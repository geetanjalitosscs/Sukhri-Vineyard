import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PostRequirement } from './post-requirement.entity';

@Entity('posts')
export class Post {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'posted_by_user_id' })
  postedBy: User;

  @Column({ name: 'posted_by_name' })
  postedByName: string;

  @Column({ name: 'posted_by_role' })
  postedByRole: string;

  @Column({ default: 'open' })
  status: string;

  @Column({ name: 'posted_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  postedAt: Date;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date;

  @OneToMany(() => PostRequirement, (req) => req.post, { cascade: true })
  requirements: PostRequirement[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

