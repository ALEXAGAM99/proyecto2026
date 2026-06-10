import { DeviceService } from './device.service';
import type { DeviceInfo } from './device.service';
export declare class DeviceController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    getAllDevices(): DeviceInfo[];
    getCount(): {
        total: number;
    };
    getByOrigin(origen: string): DeviceInfo[];
    getDevice(socketId: string): DeviceInfo;
}
