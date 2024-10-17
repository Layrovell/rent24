import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Property } from './property.entity';
import { WallType } from './wall-types.entity';

// TODO: can be made in a more flexible way later to do not store static columns
@Entity('PropertyDetails')
export class PropertyDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Property, (property) => property.details, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: number;

  @ManyToOne(() => WallType, (type) => type.property)
  @JoinColumn({ name: 'wallTypeId' })
  wallType: WallType; // e.g., brick, wood, concrete

  @Column({ nullable: true })
  yearBuilt: number;

  @Column()
  squareFootage: number;

  @Column({ nullable: true })
  energyEfficiencyRating: string;

  @Column({ nullable: true })
  floor: number;

  @Column()
  totalFloors: number;

  @Column({ type: 'date', nullable: true })
  availableFrom: Date;

  @Column({ type: 'date', nullable: true })
  availableTo: Date;

  @Column({ nullable: true })
  maxResidents: number;
}
