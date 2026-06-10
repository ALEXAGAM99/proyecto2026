export interface DeviceInfo {
    socketId: string;
    ip: string;
    tipoDispositivo: string;
    sistemaOperativo: string;
    navegador: string;
    modelo: string;
    hostname: string;
    ram: string | null;
    cpu: string | null;
    motherboard: string | null;
    serial: string | null;
    fabricante: string | null;
    arquitectura: string | null;
    plataforma: string | null;
    ipPublica: string | null;
    version: string | null;
    origen: string;
    timestamp: string;
    userAgent: string | null;
}
export declare class DeviceService {
    private readonly logger;
    private readonly connectedDevices;
    registerDevice(socketId: string, deviceInfo: DeviceInfo): DeviceInfo;
    getDevice(socketId: string): DeviceInfo | undefined;
    getAllDevices(): DeviceInfo[];
    getDeviceCount(): number;
    removeDevice(socketId: string): void;
    getDevicesByOrigin(origen: string): DeviceInfo[];
}
