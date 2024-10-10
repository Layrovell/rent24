import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Favorites } from './favorites.entity';

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

  // @ManyToMany(() => Amenity, (amenity) => amenity.properties, { cascade: true })
  // @JoinTable()
  // amenities: Amenity[];

  @ManyToOne(() => User, (user) => user.postedProperties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' }) // The foreign key column
  user: User;

  @OneToMany(() => Favorites, (favoriteProperty) => favoriteProperty.property)
  favoritedBy: Favorites[];

  // @OneToOne(() => PropertyDetails, (details) => details.property, { cascade: true })
  // @JoinColumn()
  // details: PropertyDetails;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}