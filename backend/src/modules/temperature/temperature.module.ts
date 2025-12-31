import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperatureController } from './temperature.controller';
import { TemperatureService } from './temperature.service';
import { TemperatureReading } from './entities/temperature-reading.entity';
import { Device } from '../devices/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemperatureReading, Device]),
  ],
  controllers: [TemperatureController],
  providers: [TemperatureService],
})
export class TemperatureModule {}

