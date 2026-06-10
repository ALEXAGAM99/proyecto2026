import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DeviceService } from './device.service';
export declare class DeviceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly deviceService;
    server: Server;
    private readonly logger;
    constructor(deviceService: DeviceService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleRegisterDevice(client: Socket, payload: any): void;
    handleGetDevices(client: Socket): void;
}
