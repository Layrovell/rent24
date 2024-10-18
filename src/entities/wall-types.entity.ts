import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PropertyDetails } from './property-details.entity';

@Entity('WallTypes')
export class WallType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ default: '' })
  description: string;

  @OneToMany(() => PropertyDetails, (details) => details.wallType)
  property: PropertyDetails[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
