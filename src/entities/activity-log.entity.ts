import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

export enum ActivityType {
  // Account-related activities
  REGISTRATION = 'registration',
  LOGIN = 'login', // can be moved to a separte(security) log
  LOGOUT = 'logout', // can be moved to a separte(security) log
  PASSWORD_CHANGE = 'password_change',
  PROFILE_UPDATE = 'profile_update',
  EMAIL_UPDATE = 'email_update',
  PHONE_UPDATE = 'phone_update',
  ACCOUNT_DEACTIVATION = 'account_deactivation',

  // Property-related activities
  PROPERTY_CREATED = 'property_created',
  PROPERTY_UPDATED = 'property_updated',
  PROPERTY_DELETED = 'property_deleted',
  PROPERTY_VIEWED = 'property_viewed',
  PROPERTY_RENTED = 'property_rented',
  PROPERTY_SAVED = 'property_saved',
  PROPERTY_UNSAVED = 'property_unsaved',

  // Rental Process-related activities
  RENT_REQUEST_SUBMITTED = 'rent_request_submitted',
  RENT_REQUEST_APPROVED = 'rent_request_approved',
  RENT_REQUEST_REJECTED = 'rent_request_rejected',
  RENTAL_PAYMENT_MADE = 'rental_payment_made',
  RENTAL_CONTRACT_SIGNED = 'rental_contract_signed',

  // Agent and Owner-specific activities
  AGENT_COMMISSION_SET = 'agent_commission_set',
  AGENT_PROPERTY_MANAGED = 'agent_property_managed',
  OWNER_PROPERTY_LISTED = 'owner_property_listed',
  OWNER_PROPERTY_REMOVED = 'owner_property_removed',

  // Review and Feedback-related activities
  REVIEW_SUBMITTED = 'review_submitted',
  REVIEW_DELETED = 'review_deleted',
  REVIEW_UPDATED = 'review_updated',

  // Miscellaneous Activities
  NOTIFICATION_RECEIVED = 'notification_received',
  MESSAGE_SENT = 'message_sent',
  MESSAGE_RECEIVED = 'message_received',
  OTHER = 'other',
}

@Entity('ActivityLog')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ActivityType })
  activityType: ActivityType;

  @Column({ nullable: true })
  description: string; // Optional e.g., "User updated email address"

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.activityLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // The foreign key column
  user: User;
}
