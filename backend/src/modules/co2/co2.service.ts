import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Between } from 'typeorm';
import { Co2Barrel } from './entities/co2-barrel.entity';
import { Co2RefillHistory } from './entities/co2-refill-history.entity';
import { Task } from '../tasks/entities/task.entity';
import { startOfWeek, endOfWeek } from 'date-fns';

@Injectable()
export class Co2Service {
  constructor(
    @InjectRepository(Co2Barrel)
    private barrelRepository: Repository<Co2Barrel>,
    @InjectRepository(Co2RefillHistory)
    private refillHistoryRepository: Repository<Co2RefillHistory>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getBarrels() {
    try {
      const barrels = await this.barrelRepository.find({
        relations: ['filledBy', 'vineyard'],
        order: {
          nextDueDate: 'ASC',
        },
      });
      console.log(`[Co2Service] Found ${barrels.length} CO2 barrels`);

      return barrels.map((barrel) => ({
      id: barrel.id,
      qrCode: barrel.qrCode,
      lastFilled: barrel.lastFilledDate ? formatDate(barrel.lastFilledDate) : null,
      nextDue: barrel.nextDueDate ? formatDate(barrel.nextDueDate) : null,
      status: barrel.status,
      capacity: barrel.capacityPercentage,
      location: barrel.location,
      sensorReading: barrel.sensorReading,
      filledBy: barrel.filledBy?.name || null,
      fillTime: barrel.lastFillTime ? barrel.lastFillTime.toISOString() : null,
      alertSent: barrel.alertSent,
    }));
    } catch (error) {
      console.error('[Co2Service] Error fetching barrels:', error);
      throw error;
    }
  }

  async getOverdue() {
    try {
      const today = new Date();
      const overdueBarrels = await this.barrelRepository.find({
        where: [
          { status: 'overdue' },
          { nextDueDate: LessThanOrEqual(today), status: 'ok' },
        ],
        relations: ['filledBy'],
      });
      console.log(`[Co2Service] Found ${overdueBarrels.length} overdue barrels`);

      return {
      barrels: overdueBarrels.map((barrel) => ({
        id: barrel.id,
        qrCode: barrel.qrCode,
        location: barrel.location,
        status: barrel.status,
        capacity: barrel.capacityPercentage,
        nextDue: barrel.nextDueDate ? formatDate(barrel.nextDueDate) : null,
      })),
      count: overdueBarrels.length,
    };
    } catch (error) {
      console.error('[Co2Service] Error fetching overdue barrels:', error);
      throw error;
    }
  }

  async getWeeklyCompletion() {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const refills = await this.refillHistoryRepository.find({
      where: {
        fillDate: Between(weekStart, weekEnd),
      },
    });

    const totalBarrels = await this.barrelRepository.count();
    const completed = refills.length;
    const completion = totalBarrels > 0 ? Math.round((completed / totalBarrels) * 100) : 0;

    return completion;
  }

  async getTasks() {
    const tasks = await this.taskRepository.find({
      where: {
        type: 'co2_refill',
        status: 'pending',
      },
      relations: ['assignedTo', 'barrel'],
      order: {
        dueDate: 'ASC',
      },
    });

    return tasks.map((task) => ({
      id: task.id,
      barrelId: task.barrel?.id || null,
      assignedTo: task.assignedToName,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? formatDate(task.dueDate) : null,
      createdAt: task.createdAt.toISOString(),
    }));
  }
}

function formatDate(date: Date | string): string {
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}

