import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ name: 'current_stock', type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentStock: number;

  @Column({ name: 'min_stock', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minStock: number;

  @Column()
  unit: string;

  @Column({ default: 'ok' })
  status: string;

  @Column({ nullable: true })
  supplier: string;

  @Column({ name: 'last_ordered_date', type: 'date', nullable: true })
  lastOrderedDate: Date;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ name: 'total_value', type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalValue: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

