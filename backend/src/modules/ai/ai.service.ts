import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Co2Barrel } from '../co2/entities/co2-barrel.entity';
import { InventoryItem } from '../inventory/entities/inventory-item.entity';
import { TemperatureReading } from '../temperature/entities/temperature-reading.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { format } from 'date-fns';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(Co2Barrel)
    private co2BarrelRepository: Repository<Co2Barrel>,
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(TemperatureReading)
    private temperatureRepository: Repository<TemperatureReading>,
    @InjectRepository(AttendanceRecord)
    private attendanceRepository: Repository<AttendanceRecord>,
  ) {}

  async processQuery(query: string): Promise<{ response: string }> {
    const lowerQuery = query.toLowerCase();

    // CO2 related queries
    if (lowerQuery.includes('co2') || lowerQuery.includes('barrel')) {
      const overdueBarrels = await this.co2BarrelRepository.find({
        where: { status: 'overdue' },
        order: { nextDueDate: 'ASC' },
        take: 5,
      });

      if (overdueBarrels.length > 0) {
        const barrelList = overdueBarrels
          .map((b) => `${b.id} (due ${format(b.nextDueDate, 'MMM dd')}, ${b.capacityPercentage}% capacity)`)
          .join(', ');
        return {
          response: `There are ${overdueBarrels.length} overdue CO₂ barrels: ${barrelList}. I recommend immediate refilling.`,
        };
      }

      const allBarrels = await this.co2BarrelRepository.find({
        order: { nextDueDate: 'ASC' },
        take: 5,
      });
      const dueSoon = allBarrels.filter((b) => {
        if (!b.nextDueDate) return false;
        const daysUntilDue = Math.ceil((b.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 7 && daysUntilDue > 0;
      });

      if (dueSoon.length > 0) {
        return {
          response: `There are ${dueSoon.length} CO₂ barrels due within the next week. All barrels are currently at safe capacity levels.`,
        };
      }

      return {
        response: 'All CO₂ barrels are up to date. No immediate action required.',
      };
    }

    // Inventory/Stock related queries
    if (lowerQuery.includes('stock') || lowerQuery.includes('inventory') || lowerQuery.includes('low')) {
      const lowStockItems = await this.inventoryRepository.find({
        where: { status: 'low' },
        order: { currentStock: 'ASC' },
        take: 5,
      });

      if (lowStockItems.length > 0) {
        const itemList = lowStockItems
          .map((item) => `${item.name} (${item.currentStock} ${item.unit}, min: ${item.minStock})`)
          .join(', ');
        return {
          response: `Low stock items detected: ${itemList}. I suggest placing orders for these items soon.`,
        };
      }

      const totalItems = await this.inventoryRepository.count();
      return {
        response: `All inventory items are at safe stock levels. Total items in inventory: ${totalItems}.`,
      };
    }

    // Temperature related queries
    if (lowerQuery.includes('temperature') || lowerQuery.includes('weather') || lowerQuery.includes('temp')) {
      const recentReadings = await this.temperatureRepository.find({
        order: { readingTime: 'DESC' },
        take: 50,
      });

      if (recentReadings.length > 0) {
        const temps = recentReadings.map((r) => parseFloat(r.temperature.toString()));
        const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
        const max = Math.max(...temps);
        const min = Math.min(...temps);
        const alerts = recentReadings.filter((r) => r.status === 'warning' || r.status === 'critical').length;

        return {
          response: `Current average temperature: ${avg.toFixed(1)}°C. Range: ${min.toFixed(1)}°C - ${max.toFixed(1)}°C. ${alerts > 0 ? `There are ${alerts} temperature alerts requiring attention.` : 'All readings are within normal range.'}`,
        };
      }

      return {
        response: 'No recent temperature readings available. Please check sensor connectivity.',
      };
    }

    // Attendance related queries
    if (lowerQuery.includes('attendance') || lowerQuery.includes('staff') || lowerQuery.includes('present')) {
      const records = await this.attendanceRepository.find({
        relations: ['user'],
        order: { attendanceDate: 'DESC' },
        take: 100,
      });

      if (records.length > 0) {
        const present = records.filter((r) => r.status === 'present').length;
        const absent = records.filter((r) => r.status === 'absent').length;
        const late = records.filter((r) => r.status === 'late').length;
        const total = records.length;
        const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

        return {
          response: `Recent attendance summary: ${present} present, ${absent} absent, ${late} late out of ${total} records. Overall attendance rate: ${attendanceRate}%.`,
        };
      }

      return {
        response: 'No attendance records found in the database.',
      };
    }

    // Risk/Alert queries
    if (lowerQuery.includes('risk') || lowerQuery.includes('alert') || lowerQuery.includes('issue')) {
      const overdueBarrels = await this.co2BarrelRepository.count({ where: { status: 'overdue' } });
      const lowStockItems = await this.inventoryRepository.count({ where: { status: 'low' } });
      const allReadings = await this.temperatureRepository.find();
      const tempAlerts = allReadings.filter(
        (r) => r.status === 'warning' || r.status === 'critical',
      ).length;

      const totalAlerts = overdueBarrels + lowStockItems + tempAlerts;

      if (totalAlerts > 0) {
        return {
          response: `I've detected ${totalAlerts} issues requiring attention: ${overdueBarrels} overdue CO₂ barrels, ${lowStockItems} low stock items, and ${tempAlerts} temperature alerts. Would you like detailed information on any of these?`,
        };
      }

      return {
        response: 'No critical alerts detected. All systems are operating normally.',
      };
    }

    // Default response
    return {
      response: 'I can help you with vineyard operations, CO₂ management, inventory, temperature monitoring, and attendance. What would you like to know?',
    };
  }
}

