import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { DeviceService } from 'src/devices/device.service';
import { Device } from 'src/devices/device.entity';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('user/:userId')
  getByUser(@Param('userId') userId: number) {
    return this.deviceService.findByUser(userId);
  }

  @Post()
  create(@Body() data: Partial<Device>) {
    return this.deviceService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.deviceService.remove(id);
  }
}
