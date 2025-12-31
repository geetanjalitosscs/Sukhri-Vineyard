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
import { Co2Barrel } from '../../co2/entities/co2-barrel.entity';

@Entity('tasks')
export class Task {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assigned_to_user_id' })
  assignedTo: User;

  @Column({ name: 'assigned_to_name' })
  assignedToName: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 'medium' })
  priority: string;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @ManyToOne(() => Co2Barrel, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'barrel_id' })
  barrel: Co2Barrel;

  @Column({ nullable: true })
  zone: string;

  @Column({ name: 'camera_zone', nullable: true })
  cameraZone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

