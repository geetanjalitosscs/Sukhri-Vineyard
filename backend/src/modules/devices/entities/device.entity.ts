import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vineyard } from '../../vineyards/entities/vineyard.entity';

@Entity('devices')
export class Device {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  zone: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  firmware: string;

  @ManyToOne(() => Vineyard, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vineyard_id' })
  vineyard: Vineyard;

  @Column({ name: 'barrel_id', nullable: true })
  barrelId: string;

  @Column({ name: 'last_sync', type: 'timestamp', nullable: true })
  lastSync: Date;

  @Column({ name: 'last_reading', type: 'timestamp', nullable: true })
  lastReading: Date;

  @Column({ name: 'current_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentValue: number;

  @Column({ name: 'threshold_min', type: 'decimal', precision: 10, scale: 2, nullable: true })
  thresholdMin: number;

  @Column({ name: 'threshold_max', type: 'decimal', precision: 10, scale: 2, nullable: true })
  thresholdMax: number;

  @Column({ name: 'alert_enabled', default: true })
  alertEnabled: boolean;

  @Column({ name: 'live_feed_url', nullable: true })
  liveFeedUrl: string;

  @Column({ name: 'recordings_enabled', default: false })
  recordingsEnabled: boolean;

  @Column({ name: 'total_scans', default: 0 })
  totalScans: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

