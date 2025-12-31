import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('salary')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Post()
  @Roles('hr', 'admin', 'owner')
  create(@Body() body: {
    userId: string;
    month: string;
    baseSalary: number;
    allowances?: number;
    deductions?: number;
    recordedByUserId?: string;
  }) {
    return this.salaryService.create(body);
  }

  @Get()
  @Roles('hr', 'admin', 'owner')
  findAll() {
    return this.salaryService.findAll();
  }

  @Get('user/:userId')
  @Roles('hr', 'admin', 'owner')
  findByUser(@Param('userId') userId: string) {
    return this.salaryService.findByUser(userId);
  }
}

