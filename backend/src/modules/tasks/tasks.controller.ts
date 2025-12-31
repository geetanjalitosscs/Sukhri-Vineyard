import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tasks')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @Roles('owner', 'gm', 'admin', 'hr')
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('user/:userId')
  @Roles('owner', 'gm', 'admin', 'hr', 'staff', 'cleaner', 'caretaker', 'gas-filler')
  getByUser(@Param('userId') userId: string) {
    return this.tasksService.getByUser(userId);
  }

  @Post()
  @Roles('owner', 'gm', 'admin', 'hr')
  async create(@Body() createTaskDto: {
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
    return this.tasksService.create(createTaskDto);
  }
}

