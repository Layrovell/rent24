import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('Session')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: false })
  online: boolean;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  deviceName: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;
}
