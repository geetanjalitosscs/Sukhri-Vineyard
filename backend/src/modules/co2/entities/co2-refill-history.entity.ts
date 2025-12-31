import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Co2Barrel } from './co2-barrel.entity';
import { User } from '../../users/entities/user.entity';

@Entity('co2_refill_history')
export class Co2RefillHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Co2Barrel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barrel_id' })
  barrel: Co2Barrel;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'filled_by_user_id' })
  filledBy: User;

  @Column({ name: 'fill_date', type: 'date' })
  fillDate: Date;

  @Column({ name: 'fill_time', type: 'timestamp' })
  fillTime: Date;

  @Column({ name: 'capacity_before', nullable: true })
  capacityBefore: number;

  @Column({ name: 'capacity_after', nullable: true })
  capacityAfter: number;

  @Column({ name: 'sensor_reading', nullable: true })
  sensorReading: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

