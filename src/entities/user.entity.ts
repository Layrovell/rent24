import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { ActivityLog } from './activity-log.entity';
import { UserProfile } from './profile.entity';
import { Property } from './property.entity';
import { Favorites } from './favorites.entity';
import { AgentProfile } from './agent-profile.entity';

export enum Role {
  GUEST = 'guest',
  USER = 'user',
  AGENT = 'agent',
  MODERATOR = 'moderator',
  // ADMIN = 'admin' // not needed right now. TODO: separate table for Roles
}

@Entity('Users') // Specify the exact name of the table in the database
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  firstName: string;

  // loginMethodCode: COGNITO_PASSWORD | google | facebook | gh

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column()
  hashedPassword: string;

  // it will be automatically set
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSignIn: Date;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    onDelete: 'RESTRICT',
  })
  //  In a one-to-one relationship, the side that owns the relationship gets the @JoinColumn()
  @JoinColumn({ name: 'userProfileId' })
  userProfile: UserProfile; // Each user has one profile created at registration

  @OneToOne(() => AgentProfile, (profile) => profile.user, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'agentProfileId' })
  agentProfile: AgentProfile;

  @OneToMany(() => ActivityLog, (log) => log.user, { onDelete: 'CASCADE' })
  activityLogs: ActivityLog[];

  @OneToMany(() => Property, (property) => property.user, {
    onDelete: 'CASCADE',
  })
  postedProperties: Property[];

  @OneToMany(() => Favorites, (fav) => fav.user, { onDelete: 'CASCADE' })
  favoriteProperties: Favorites[];
}

// @DeleteDateColumn is a special column that is automatically set
// to the entity's delete time each time you call soft-delete of
// entity manager or repository. You don't need to set this column -
// it will be automatically set. If the @DeleteDateColumn is set,
// the default scope will be "non-deleted".
