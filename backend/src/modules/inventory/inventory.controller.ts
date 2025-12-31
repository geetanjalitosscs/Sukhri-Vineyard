import { Controller, Get, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('inventory')
// Temporarily disabled for testing - re-enable in production
// @UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @Roles('owner', 'gm', 'admin', 'staff')
  async findAll() {
    try {
      const inventory = await this.inventoryService.findAll();
      console.log(`[InventoryController] Returning ${inventory.totalItems} items`);
      return inventory;
    } catch (error) {
      console.error('[InventoryController] Error in findAll:', error);
      throw error;
    }
  }

  @Get('low-stock')
  @Roles('owner', 'gm', 'admin')
  getLowStock() {
    return this.inventoryService.getLowStock();
  }
}

