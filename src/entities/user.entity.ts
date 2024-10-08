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
import { Profile } from './profile.entity';

export enum Role {
  GUEST = 'guest',
  USER = 'user',
  AGENT = 'agent',
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
  email: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
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

  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile; // Each user has one profile created at registration

  @Column()
  profileId: number;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user)
  activityLogs: ActivityLog[];
}

// @DeleteDateColumn is a special column that is automatically set
// to the entity's delete time each time you call soft-delete of
// entity manager or repository. You don't need to set this column -
// it will be automatically set. If the @DeleteDateColumn is set,
// the default scope will be "non-deleted".