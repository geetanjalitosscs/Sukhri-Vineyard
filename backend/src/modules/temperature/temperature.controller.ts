import { Controller, Get, UseGuards } from '@nestjs/common';
import { TemperatureService } from './temperature.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('temperature')
export class TemperatureController {
  constructor(private temperatureService: TemperatureService) {}

  @Get('readings')
  // Temporarily removed auth for testing - add back in production
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('owner', 'gm', 'admin', 'caretaker')
  async getReadings() {
    try {
      const readings = await this.temperatureService.getReadings();
      console.log(`[TemperatureController] Returning ${readings.length} readings`);
      return readings;
    } catch (error) {
      console.error('[TemperatureController] Error in getReadings:', error);
      throw error;
    }
  }

  @Get('stats')
  // Temporarily removed auth for testing - add back in production
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('owner', 'gm', 'admin')
  async getStats() {
    try {
      const stats = await this.temperatureService.getStats();
      console.log(`[TemperatureController] Returning stats:`, stats);
      return stats;
    } catch (error) {
      console.error('[TemperatureController] Error in getStats:', error);
      throw error;
    }
  }
}

