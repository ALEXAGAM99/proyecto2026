import { Injectable, Logger } from '@nestjs/common';

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

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  private readonly connectedDevices = new Map<string, DeviceInfo>();


  registerDevice(socketId: string, deviceInfo: DeviceInfo): DeviceInfo {
    this.connectedDevices.set(socketId, deviceInfo);
    return deviceInfo;
  }


  getDevice(socketId: string): DeviceInfo | undefined {
    return this.connectedDevices.get(socketId);
  }


  getAllDevices(): DeviceInfo[] {
    return Array.from(this.connectedDevices.values());
  }


  getDeviceCount(): number {
    return this.connectedDevices.size;
  }


  removeDevice(socketId: string): void {
    const device = this.connectedDevices.get(socketId);
    if (device) {
      this.connectedDevices.delete(socketId);
    }
  }

  getDevicesByOrigin(origen: string): DeviceInfo[] {
    return Array.from(this.connectedDevices.values()).filter(
      (d) => d.origen === origen,
    );
  }
}
