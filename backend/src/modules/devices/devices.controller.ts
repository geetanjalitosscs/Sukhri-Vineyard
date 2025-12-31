import { Controller, Get, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('devices')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Get()
  @Roles('owner', 'gm', 'admin')
  findAll() {
    return this.devicesService.findAll();
  }

  @Get('cameras')
  @Roles('owner', 'gm', 'admin', 'hr')
  getCameras() {
    return this.devicesService.getCameras();
  }
}

