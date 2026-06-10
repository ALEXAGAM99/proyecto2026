import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { DeviceService } from './device.service';
import { UAParser } from 'ua-parser-js';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
  namespace: '/',
})
export class DeviceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('DeviceGateway');

  constructor(private readonly deviceService: DeviceService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Inicializado correctamente');
  }

  handleConnection(client: Socket) {
    const ip =
      client.handshake.headers['x-forwarded-for'] ||
      client.handshake.address ||
      'desconocida';

    client.emit('lista_dispositivos', this.deviceService.getAllDevices());
  }

  handleDisconnect(client: Socket) {
    this.deviceService.removeDevice(client.id);

    this.server.emit('dispositivo_desconectado', { socketId: client.id });
  }

  @SubscribeMessage('registrar_dispositivo')
  handleRegisterDevice(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {

    const ipRaw =
      (client.handshake.headers['x-forwarded-for'] as string) ||
      client.handshake.address ||
      'desconocida';

    const ip = ipRaw.replace(/^::ffff:/, '');

    let uaData: any = {};
    const userAgent = client.handshake.headers['user-agent'];
    if (userAgent) {
      const parser = new UAParser(userAgent);
      const result = parser.getResult();
      uaData = {
        navegadorUA: result.browser?.name || null,
        navegadorVersionUA: result.browser?.version || null,
        sistemaOperativoUA: result.os?.name || null,
        dispositivoUA: result.device?.type || 'desktop',
      };
    }

    const deviceInfo = {
      socketId: client.id,
      ip,
      tipoDispositivo: payload?.tipoDispositivo || uaData.dispositivoUA || 'desconocido',
      sistemaOperativo: payload?.sistemaOperativo || uaData.sistemaOperativoUA || 'desconocido',
      navegador: payload?.navegador || uaData.navegadorUA || 'desconocido',
      modelo: payload?.modelo || 'desconocido',
      hostname: payload?.hostname || 'desconocido',
      ram: payload?.ram || null,
      cpu: payload?.cpu || null,
      motherboard: payload?.motherboard || null,
      serial: payload?.serial || null,
      fabricante: payload?.fabricante || null,
      arquitectura: payload?.arquitectura || null,
      plataforma: payload?.plataforma || null,
      ipPublica: payload?.ipPublica || null,
      version: payload?.version || null,
      origen: payload?.origen || 'desconocido',
      timestamp: new Date().toISOString(),
      userAgent: userAgent || null,
    };

    this.deviceService.registerDevice(client.id, deviceInfo);


    client.emit('dispositivo_registrado', {
      success: true,
      socketId: client.id,
      mensaje: 'Dispositivo registrado correctamente',
    });

    this.server.emit('nuevo_dispositivo', deviceInfo);

    this.server.emit('lista_dispositivos', this.deviceService.getAllDevices());
  }


  @SubscribeMessage('obtener_dispositivos')
  handleGetDevices(@ConnectedSocket() client: Socket): void {
    const devices = this.deviceService.getAllDevices();
    client.emit('lista_dispositivos', devices);
  }
}
