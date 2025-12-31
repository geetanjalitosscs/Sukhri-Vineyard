import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemperatureReading } from './entities/temperature-reading.entity';
import { Device } from '../devices/entities/device.entity';
import { format } from 'date-fns';

@Injectable()
export class TemperatureService {
  constructor(
    @InjectRepository(TemperatureReading)
    private readingRepository: Repository<TemperatureReading>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  async getReadings(deviceId?: string) {
    try {
      // Get all readings with device relation, then sort and take most recent 50
      const findOptions: any = {
        relations: ['device'],
        order: {
          readingTime: 'DESC',
        },
      };

      if (deviceId) {
        findOptions.where = { device: { id: deviceId } };
      }

      let readings = await this.readingRepository.find(findOptions);
      console.log(`[TemperatureService] Found ${readings.length} temperature readings`);

      // Take most recent 50 and reverse for chronological order
      readings = readings.slice(0, 50).reverse();

      return readings.map((reading) => ({
        time: format(new Date(reading.readingTime), 'HH:mm'),
        temperature: parseFloat(reading.temperature.toString()),
        humidity: reading.humidity ? parseFloat(reading.humidity.toString()) : null,
        status: reading.status,
      }));
    } catch (error) {
      console.error('[TemperatureService] Error fetching readings:', error);
      throw error;
    }
  }

  async getStats(deviceId?: string) {
    try {
      // Get all readings with device relation, then sort and take most recent 50 for stats
      const findOptions: any = {
        relations: ['device'],
        order: {
          readingTime: 'DESC',
        },
      };

      if (deviceId) {
        findOptions.where = { device: { id: deviceId } };
      }

      let readings = await this.readingRepository.find(findOptions);
      console.log(`[TemperatureService] Found ${readings.length} readings for stats`);

      // Take most recent 50
      readings = readings.slice(0, 50);

      if (readings.length === 0) {
        console.log('[TemperatureService] No readings found, returning zero stats');
        return {
          average: 0,
          max: 0,
          min: 0,
          alerts: 0,
        };
      }

      const temperatures = readings.map((r) => parseFloat(r.temperature.toString()));
      const average = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
      const max = Math.max(...temperatures);
      const min = Math.min(...temperatures);
      const alerts = readings.filter((r) => r.status === 'warning' || r.status === 'critical').length;

      return {
        average: Math.round(average * 10) / 10,
        max: Math.round(max * 10) / 10,
        min: Math.round(min * 10) / 10,
        alerts,
      };
    } catch (error) {
      console.error('[TemperatureService] Error fetching stats:', error);
      throw error;
    }
  }
}

