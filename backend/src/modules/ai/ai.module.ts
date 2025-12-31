import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { Co2Barrel } from '../co2/entities/co2-barrel.entity';
import { InventoryItem } from '../inventory/entities/inventory-item.entity';
import { TemperatureReading } from '../temperature/entities/temperature-reading.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Co2Barrel, InventoryItem, TemperatureReading, AttendanceRecord]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}

