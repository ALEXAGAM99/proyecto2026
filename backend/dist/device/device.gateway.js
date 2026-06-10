"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const device_service_1 = require("./device.service");
const ua_parser_js_1 = require("ua-parser-js");
let DeviceGateway = class DeviceGateway {
    deviceService;
    server;
    logger = new common_1.Logger('DeviceGateway');
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    afterInit(server) {
        this.logger.log('WebSocket Inicializado correctamente');
    }
    handleConnection(client) {
        const ip = client.handshake.headers['x-forwarded-for'] ||
            client.handshake.address ||
            'desconocida';
        this.logger.log(`🔌 Cliente conectado: ${client.id} | IP: ${ip}`);
        client.emit('lista_dispositivos', this.deviceService.getAllDevices());
    }
    handleDisconnect(client) {
        this.logger.log(`Cliente desconectado: ${client.id}`);
        this.deviceService.removeDevice(client.id);
        this.server.emit('dispositivo_desconectado', { socketId: client.id });
    }
    handleRegisterDevice(client, payload) {
        this.logger.log(`📥 Registrando dispositivo de: ${client.id} | Tipo: ${payload?.tipoDispositivo || 'desconocido'}`);
        const ipRaw = client.handshake.headers['x-forwarded-for'] ||
            client.handshake.address ||
            'desconocida';
        const ip = ipRaw.replace(/^::ffff:/, '');
        let uaData = {};
        const userAgent = client.handshake.headers['user-agent'];
        if (userAgent) {
            const parser = new ua_parser_js_1.UAParser(userAgent);
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
    handleGetDevices(client) {
        const devices = this.deviceService.getAllDevices();
        client.emit('lista_dispositivos', devices);
        this.logger.log(`Lista de dispositivos enviada a ${client.id} (${devices.length} dispositivos)`);
    }
};
exports.DeviceGateway = DeviceGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], DeviceGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('registrar_dispositivo'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], DeviceGateway.prototype, "handleRegisterDevice", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('obtener_dispositivos'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], DeviceGateway.prototype, "handleGetDevices", null);
exports.DeviceGateway = DeviceGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: false,
        },
        namespace: '/',
    }),
    __metadata("design:paramtypes", [device_service_1.DeviceService])
], DeviceGateway);
//# sourceMappingURL=device.gateway.js.map