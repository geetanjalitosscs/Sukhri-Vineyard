import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  async findAll() {
    const devices = await this.deviceRepository.find({
      relations: ['vineyard'],
      order: {
        name: 'ASC',
      },
    });

    return {
      iotDevices: devices.filter((d) => ['temperature', 'co2'].includes(d.type)),
      cameras: devices.filter((d) => d.type === 'cctv'),
      attendanceDevices: devices.filter((d) => ['biometric', 'face', 'qr'].includes(d.type)),
    };
  }

  async getCameras() {
    const cameras = await this.deviceRepository.find({
      where: { type: 'cctv' },
      relations: ['vineyard'],
      order: {
        name: 'ASC',
      },
    });

    return cameras.map((camera) => ({
      id: camera.id,
      name: camera.name,
      location: camera.location,
      zone: camera.zone,
      status: camera.status,
      lastSync: camera.lastSync ? camera.lastSync.toISOString() : null,
      liveFeedUrl: camera.liveFeedUrl,
      recordingsEnabled: camera.recordingsEnabled,
    }));
  }
}

