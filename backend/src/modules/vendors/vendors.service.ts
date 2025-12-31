import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
  ) {}

  async findAll() {
    const vendors = await this.vendorRepository.find({
      relations: ['user'],
      order: {
        name: 'ASC',
      },
    });

    return vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      contact: vendor.contactEmail,
      phone: vendor.phone,
      rating: parseFloat(vendor.rating.toString()),
      totalOrders: vendor.totalOrders,
      activeOrders: vendor.activeOrders,
      status: vendor.status,
      performance: {
        onTimeDelivery: parseFloat(vendor.onTimeDeliveryPercentage.toString()),
        qualityScore: parseFloat(vendor.qualityScore.toString()),
        responseTime: vendor.averageResponseTimeHours,
      },
    }));
  }

  async getPurchaseOrders() {
    try {
      // Load orders with left joins to handle missing relations gracefully
      const orders = await this.purchaseOrderRepository
        .createQueryBuilder('po')
        .leftJoinAndSelect('po.vendor', 'vendor')
        .leftJoinAndSelect('po.items', 'items')
        .leftJoinAndSelect('po.requestedBy', 'requestedBy')
        .leftJoinAndSelect('po.approvedBy', 'approvedBy')
        .orderBy('po.orderDate', 'DESC')
        .getMany();

      const openPOs = orders.filter((po) => 
        ['pending_approval', 'approved', 'dispatched'].includes(po.status)
      ).length;
      const closedPOs = orders.filter((po) => po.status === 'delivered').length;

      return {
        purchaseOrders: orders.map((order) => {
          try {
            return {
              id: order.id,
              vendor: order.vendor?.name || 'Unknown',
              vendorId: order.vendor?.id || null,
              items: order.items?.map((item) => ({
                name: item.itemName || 'Unknown',
                quantity: item.quantity ? parseFloat(item.quantity.toString()) : 0,
                unit: item.unit || '',
              })) || [],
              status: order.status,
              orderDate: order.orderDate 
                ? (order.orderDate instanceof Date 
                    ? order.orderDate.toISOString().split('T')[0] 
                    : new Date(order.orderDate).toISOString().split('T')[0])
                : null,
              expectedDelivery: order.expectedDeliveryDate 
                ? (order.expectedDeliveryDate instanceof Date 
                    ? order.expectedDeliveryDate.toISOString().split('T')[0] 
                    : new Date(order.expectedDeliveryDate).toISOString().split('T')[0])
                : null,
              deliveryDate: order.deliveryDate 
                ? (order.deliveryDate instanceof Date 
                    ? order.deliveryDate.toISOString().split('T')[0] 
                    : new Date(order.deliveryDate).toISOString().split('T')[0])
                : null,
              requestedBy: order.requestedByRole || null,
              requestedByName: order.requestedByName || null,
              approvedBy: order.approvedBy?.name || null,
              approvedAt: order.approvedAt 
                ? (order.approvedAt instanceof Date 
                    ? order.approvedAt.toISOString() 
                    : new Date(order.approvedAt).toISOString())
                : null,
              invoiceUploaded: order.invoiceUploaded || false,
              invoiceUrl: order.invoiceUrl || null,
              dispatchStatus: order.dispatchStatus || null,
              totalAmount: order.totalAmount ? parseFloat(order.totalAmount.toString()) : 0,
            };
          } catch (e) {
            console.error('Error mapping purchase order:', order.id, e);
            return {
              id: order.id,
              vendor: 'Unknown',
              vendorId: null,
              items: [],
              status: order.status || 'unknown',
              orderDate: null,
              expectedDelivery: null,
              deliveryDate: null,
              requestedBy: null,
              requestedByName: null,
              approvedBy: null,
              approvedAt: null,
              invoiceUploaded: false,
              invoiceUrl: null,
              dispatchStatus: null,
              totalAmount: 0,
            };
          }
        }),
        activeVendors: await this.vendorRepository.count({ where: { status: 'active' } }),
        openPOs,
        closedPOs,
        pendingApprovals: orders.filter((po) => po.status === 'pending_approval').length,
      };
    } catch (error) {
      console.error('Error in getPurchaseOrders:', error);
      throw error;
    }
  }
}

