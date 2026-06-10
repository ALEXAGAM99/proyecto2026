import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('enviar_mensaje')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {

    this.server.emit('recibir_mensaje', {
      emisorId: client.id,
      contenido: data
    });
  }

  emitirActualizacion() {
    this.server.emit('actualizar_datos', { mensaje: 'Refrescar datos' });
    this.server.emit('actualizar_doctores', { mensaje: 'Refrescar datos de doctores' });
  }


  forzarLogout(sessionId: number | string) {
    this.server.emit('forzar_logout', { session_id: sessionId });
    this.server.emit('actualizar_datos', { tipo: 'auditoria' });
  }


}