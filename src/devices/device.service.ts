// src/modules/device/device.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from 'src/devices/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  findByUser(userId: number) {
    return this.deviceRepository.find({
      where: { user: { id: userId } },
      order: { last_used: 'DESC' },
    });
  }

  create(data: Partial<Device>) {
    return this.deviceRepository.save(data);
  }

  remove(id: number) {
    return this.deviceRepository.delete(id);
  }
}
