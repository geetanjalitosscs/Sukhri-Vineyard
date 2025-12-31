import { Controller, Get, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('vendors')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Get()
  @Roles('owner', 'gm', 'admin', 'vendor')
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get('purchase-orders')
  @Roles('owner', 'gm', 'admin', 'vendor')
  getPurchaseOrders() {
    return this.vendorsService.getPurchaseOrders();
  }
}

