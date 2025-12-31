import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column()
  name: string;

  @Column({ name: 'contact_email', nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ name: 'total_orders', default: 0 })
  totalOrders: number;

  @Column({ name: 'active_orders', default: 0 })
  activeOrders: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ name: 'on_time_delivery_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  onTimeDeliveryPercentage: number;

  @Column({ name: 'quality_score', type: 'decimal', precision: 3, scale: 2, default: 0 })
  qualityScore: number;

  @Column({ name: 'average_response_time_hours', default: 0 })
  averageResponseTimeHours: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

