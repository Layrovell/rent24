import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Activities } from './activities.entity';

@Entity('ActivityLog')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Activities)
  @JoinColumn({ name: 'activityId' })
  activity: Activities;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.activityLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // The foreign key column
  user: User;
}
