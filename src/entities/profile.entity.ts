import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('Profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  description: string;

  @Column({ nullable: true })
  companyName: string | null; // Only for agents

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2 })
  commissionRate: number; // Percentage commission for agents (e.g., 10%)

  @Column({ nullable: true })
  fixedFee: number; // Flat fee, if the agent works with fixed pricing

  @Column({ default: false })
  isLookingForApartment: boolean; // Can be used to display a badge on the profile

  // @Column('int', { array: true, default: [] })
  // savedProperties: number[];

  // @Column('int', { array: true, default: [] })
  // postedProperties: number[];  // Properties listed by Owners or Agents

  @OneToOne(() => User, (user) => user.profile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User; // The user this profile belongs to
}
