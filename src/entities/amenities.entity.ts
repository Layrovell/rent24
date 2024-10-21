import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Amenities')
export class Amenities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  code: string;

  @Column({ default: '' })
  description: string;

  @Column({ length: 50, nullable: true })
  unit: string;

  @Column({ length: 50 })
  valueType: string; // Data type of the amenity value (e.g., boolean, number, string)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
