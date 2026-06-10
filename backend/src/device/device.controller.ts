import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DeviceService } from './device.service';
import type { DeviceInfo } from './device.service';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) { }

  @Get()
  getAllDevices(): DeviceInfo[] {
    return this.deviceService.getAllDevices();
  }

  @Get('count')
  getCount(): { total: number } {
    return { total: this.deviceService.getDeviceCount() };
  }

  @Get('origen/:origen')
  getByOrigin(@Param('origen') origen: string): DeviceInfo[] {
    return this.deviceService.getDevicesByOrigin(origen);
  }

  @Get(':socketId')
  getDevice(@Param('socketId') socketId: string): DeviceInfo {
    const device = this.deviceService.getDevice(socketId);
    if (!device) {
      throw new NotFoundException(
        `Dispositivo con socket ID "${socketId}" no encontrado`,
      );
    }
    return device;
  }
}
