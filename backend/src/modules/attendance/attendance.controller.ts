import { Controller, Get, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('attendance')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Get('today')
  @Roles('owner', 'hr', 'admin', 'gm')
  async getTodayAttendance() {
    try {
      const today = await this.attendanceService.getTodayAttendance();
      console.log(`[AttendanceController] Returning today attendance: ${today.present} present`);
      return today;
    } catch (error) {
      console.error('[AttendanceController] Error in getTodayAttendance:', error);
      throw error;
    }
  }

  @Get('weekly')
  @Roles('owner', 'hr', 'admin', 'gm')
  async getWeeklyStats() {
    try {
      const weekly = await this.attendanceService.getWeeklyStats();
      console.log(`[AttendanceController] Returning weekly stats`);
      return weekly;
    } catch (error) {
      console.error('[AttendanceController] Error in getWeeklyStats:', error);
      throw error;
    }
  }

  @Get('records')
  @Roles('owner', 'hr', 'admin', 'gm')
  async getRecords() {
    try {
      const records = await this.attendanceService.getRecords();
      console.log(`[AttendanceController] Returning ${records.length} attendance records`);
      return records;
    } catch (error) {
      console.error('[AttendanceController] Error in getRecords:', error);
      throw error;
    }
  }
}

