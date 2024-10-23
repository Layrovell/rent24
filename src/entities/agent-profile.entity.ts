import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('AgentProfile')
export class AgentProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  companyName: string;

  @Column()
  @IsOptional()
  @IsString()
  title: string;

  @Column()
  @IsOptional()
  @IsString()
  description: string;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  @IsNumber()
  commissionRate: number; // Percentage commission for agents (e.g., 10%)

  @Column({ nullable: true })
  @IsNumber()
  fixedFee: number; // Flat fee, if the agent works with fixed pricing

  @OneToOne(() => User, (user) => user.agentProfile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
