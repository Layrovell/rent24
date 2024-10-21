import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Favorites } from './favorites.entity';
import { PropertyDetails } from './property-details.entity';
import { PropertyAmenities } from './property-amenities.entity';

export enum PropertyType {
  ROOM = 'room',
  APARTMENT = 'apartment',
  HOUSE = 'house',
}

@Entity('Properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
    default: null,
    nullable: true,
  })
  propertyType: PropertyType;

  @Column('decimal', { nullable: true })
  pricePerMonth: number;

  @Column('decimal', { nullable: true })
  pricePerDay: number;

  @Column({ default: false })
  longTerm: boolean;

  @OneToMany(() => PropertyAmenities, (amenity) => amenity.property)
  amenities: PropertyAmenities[];

  @ManyToOne(() => User, (user) => user.postedProperties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' }) // The foreign key column
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Favorites, (favoriteProperty) => favoriteProperty.property)
  favoritedBy: Favorites[];

  @OneToOne(() => PropertyDetails, (details) => details.property, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'detailsId' })
  details: PropertyDetails;

  @Column({ nullable: true })
  detailsId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
