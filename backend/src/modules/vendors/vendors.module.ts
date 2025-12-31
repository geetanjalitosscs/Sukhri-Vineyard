import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, PurchaseOrder, PurchaseOrderItem]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}

