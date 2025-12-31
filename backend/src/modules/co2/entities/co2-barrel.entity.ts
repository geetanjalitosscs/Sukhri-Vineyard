import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vineyard } from '../../vineyards/entities/vineyard.entity';
import { User } from '../../users/entities/user.entity';
import { Co2RefillHistory } from './co2-refill-history.entity';

@Entity('co2_barrels')
export class Co2Barrel {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'qr_code', unique: true })
  qrCode: string;

  @Column()
  location: string;

  @ManyToOne(() => Vineyard, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vineyard_id' })
  vineyard: Vineyard;

  @Column({ name: 'capacity_percentage', default: 0 })
  capacityPercentage: number;

  @Column({ default: 'ok' })
  status: string;

  @Column({ name: 'last_filled_date', type: 'date', nullable: true })
  lastFilledDate: Date;

  @Column({ name: 'next_due_date', type: 'date', nullable: true })
  nextDueDate: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'filled_by_user_id' })
  filledBy: User;

  @Column({ name: 'last_fill_time', type: 'timestamp', nullable: true })
  lastFillTime: Date;

  @Column({ name: 'sensor_reading', nullable: true })
  sensorReading: number;

  @Column({ name: 'alert_sent', default: false })
  alertSent: boolean;

  @OneToMany(() => Co2RefillHistory, (history) => history.barrel)
  refillHistory: Co2RefillHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

