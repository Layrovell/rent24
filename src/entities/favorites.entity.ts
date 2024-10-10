import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Property } from './property.entity';

@Entity('Favorites')
export class Favorites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favoriteProperties, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Property, (property) => property.favoritedBy, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;
}
