import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Property } from './property.entity';
import { Amenities } from './amenities.entity';

@Entity('PropertyAmenities')
export class PropertyAmenities {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property, (property) => property.amenities)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @ManyToOne(() => Amenities)
  @JoinColumn({ name: 'amenityId' })
  amenity: Amenities;

  @Column({ type: 'json' })
  value: number | boolean;
}
