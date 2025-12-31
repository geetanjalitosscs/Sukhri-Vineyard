import { Controller, Get, UseGuards } from '@nestjs/common';
import { Co2Service } from './co2.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('co2')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class Co2Controller {
  constructor(private co2Service: Co2Service) {}

  @Get('barrels')
  @Roles('owner', 'gm', 'admin', 'gas-filler')
  async getBarrels() {
    try {
      const barrels = await this.co2Service.getBarrels();
      console.log(`[Co2Controller] Returning ${barrels.length} barrels`);
      return barrels;
    } catch (error) {
      console.error('[Co2Controller] Error in getBarrels:', error);
      throw error;
    }
  }

  @Get('overdue')
  @Roles('owner', 'gm', 'admin')
  async getOverdue() {
    try {
      const overdue = await this.co2Service.getOverdue();
      console.log(`[Co2Controller] Returning ${overdue.count} overdue barrels`);
      return overdue;
    } catch (error) {
      console.error('[Co2Controller] Error in getOverdue:', error);
      throw error;
    }
  }
}

