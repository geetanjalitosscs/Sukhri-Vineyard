import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Device } from '../../devices/entities/device.entity';
import { Vineyard } from '../../vineyards/entities/vineyard.entity';

@Entity('temperature_readings')
export class TemperatureReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Device, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @Column({ name: 'reading_time', type: 'timestamp' })
  readingTime: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidity: number;

  @Column({ default: 'normal' })
  status: string;

  @ManyToOne(() => Vineyard, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vineyard_id' })
  vineyard: Vineyard;

  @Column({ nullable: true })
  zone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

