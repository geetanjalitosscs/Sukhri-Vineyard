import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) {}

  async findAll() {
    try {
      console.log('[InventoryService] Fetching inventory items...');
      const items = await this.inventoryRepository.find({
        order: {
          name: 'ASC',
        },
      });
      console.log(`[InventoryService] Found ${items.length} inventory items`);

      const lowStockItems = items.filter((item) => item.status === 'low');
      const totalValue = items.reduce((sum, item) => {
        try {
          const value = item.totalValue ? parseFloat(item.totalValue.toString()) : 0;
          return sum + (isNaN(value) ? 0 : value);
        } catch (e) {
          return sum;
        }
      }, 0);

      return {
        items: items.map((item) => {
          // Safely parse decimal values
          const currentStock = item.currentStock 
            ? (typeof item.currentStock === 'string' ? parseFloat(item.currentStock) : Number(item.currentStock))
            : 0;
          const minStock = item.minStock 
            ? (typeof item.minStock === 'string' ? parseFloat(item.minStock) : Number(item.minStock))
            : 0;
          
          // Safely parse lastOrderedDate
          let lastOrdered: string | null = null;
          try {
            if (item.lastOrderedDate) {
              const date = item.lastOrderedDate instanceof Date 
                ? item.lastOrderedDate 
                : new Date(item.lastOrderedDate);
              if (!isNaN(date.getTime())) {
                lastOrdered = date.toISOString().split('T')[0];
              }
            }
          } catch (e) {
            // Ignore date parsing errors
          }

          return {
            id: item.id,
            name: item.name,
            category: item.category,
            currentStock: isNaN(currentStock) ? 0 : currentStock,
            minStock: isNaN(minStock) ? 0 : minStock,
            unit: item.unit,
            status: item.status,
            lastOrdered,
            supplier: item.supplier,
          };
        }),
        lowStockCount: lowStockItems.length,
        totalItems: items.length,
        totalValue: Math.round(totalValue),
      };
    } catch (error) {
      console.error('[InventoryService] Error in findAll:', error);
      throw error;
    }
  }

  async getLowStock() {
    try {
      const items = await this.inventoryRepository.find({
        where: [
          { status: 'low' },
          { status: 'critical' },
        ],
        order: {
          currentStock: 'ASC',
        },
      });

      return {
        items: items.map((item) => {
          const currentStock = item.currentStock 
            ? (typeof item.currentStock === 'string' ? parseFloat(item.currentStock) : Number(item.currentStock))
            : 0;
          const minStock = item.minStock 
            ? (typeof item.minStock === 'string' ? parseFloat(item.minStock) : Number(item.minStock))
            : 0;
          
          return {
            id: item.id,
            name: item.name,
            category: item.category,
            currentStock: isNaN(currentStock) ? 0 : currentStock,
            minStock: isNaN(minStock) ? 0 : minStock,
            unit: item.unit,
            status: item.status,
            supplier: item.supplier,
          };
        }),
        count: items.length,
      };
    } catch (error) {
      console.error('Error in getLowStock:', error);
      throw error;
    }
  }
}

