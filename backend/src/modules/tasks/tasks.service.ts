import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Co2Barrel } from '../co2/entities/co2-barrel.entity';
import { format } from 'date-fns';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const tasks = await this.taskRepository.find({
      relations: ['assignedTo', 'createdBy', 'barrel'],
      order: {
        createdAt: 'DESC',
      },
    });

    const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const today = new Date();
    const completedToday = tasks.filter((t) => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return (
        completedDate.getDate() === today.getDate() &&
        completedDate.getMonth() === today.getMonth() &&
        completedDate.getFullYear() === today.getFullYear()
      );
    }).length;

    return {
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        type: task.type,
        assignedTo: task.assignedToName,
        assignedToId: task.assignedTo?.id || null,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : null,
        location: task.location,
        zone: task.zone,
        description: task.description,
        createdAt: task.createdAt.toISOString(),
      })),
      pendingTasks,
      inProgressTasks,
      completedToday,
    };
  }

  async getByUser(userId: string) {
    const tasks = await this.taskRepository.find({
      where: { assignedTo: { id: userId } },
      relations: ['assignedTo', 'createdBy', 'barrel'],
      order: {
        createdAt: 'DESC',
      },
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      type: task.type,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : null,
      location: task.location,
    }));
  }

  async create(createTaskDto: {
    title: string;
    type: string;
    assignedToUserId: string;
    assignedToName: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    barrelId?: string;
    zone?: string;
    cameraZone?: string;
    location?: string;
    description?: string;
    createdByUserId?: string;
  }) {
    // Generate task ID
    const existingTasks = await this.taskRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });

    let taskNumber = 1;
    if (existingTasks.length > 0) {
      const lastTaskId = existingTasks[0].id;
      const match = lastTaskId.match(/TASK-(\d+)/);
      if (match) {
        taskNumber = parseInt(match[1], 10) + 1;
      }
    }

    const taskId = `TASK-${taskNumber.toString().padStart(3, '0')}`;

    // Get assigned user
    const assignedUser = await this.dataSource.getRepository(User).findOne({
      where: { id: createTaskDto.assignedToUserId },
    });

    if (!assignedUser) {
      throw new Error('Assigned user not found');
    }

    // Get created by user if provided
    let createdByUser = null;
    if (createTaskDto.createdByUserId) {
      createdByUser = await this.dataSource.getRepository(User).findOne({
        where: { id: createTaskDto.createdByUserId },
      });
    }

    // Get barrel if provided
    let barrel = null;
    if (createTaskDto.barrelId) {
      barrel = await this.dataSource.getRepository(Co2Barrel).findOne({
        where: { id: createTaskDto.barrelId },
      });
    }

    const task = this.taskRepository.create({
      id: taskId,
      title: createTaskDto.title,
      type: createTaskDto.type,
      assignedTo: assignedUser,
      assignedToName: createTaskDto.assignedToName,
      status: createTaskDto.status || 'pending',
      priority: createTaskDto.priority || 'medium',
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      barrel: barrel || null,
      zone: createTaskDto.zone || null,
      cameraZone: createTaskDto.cameraZone || null,
      location: createTaskDto.location || null,
      description: createTaskDto.description || null,
      createdBy: createdByUser || null,
    });

    const savedTask = await this.taskRepository.save(task);

    return {
      id: savedTask.id,
      title: savedTask.title,
      type: savedTask.type,
      assignedTo: savedTask.assignedToName,
      assignedToId: savedTask.assignedTo?.id || null,
      status: savedTask.status,
      priority: savedTask.priority,
      dueDate: savedTask.dueDate ? format(savedTask.dueDate, 'yyyy-MM-dd') : null,
      location: savedTask.location,
      zone: savedTask.zone,
      description: savedTask.description,
      createdAt: savedTask.createdAt.toISOString(),
    };
  }
}

