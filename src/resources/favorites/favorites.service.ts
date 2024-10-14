import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Favorites } from 'src/entities';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';
import { PropertyService } from '../property/property.service';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private propertyService: PropertyService
  ) {}

  async getFavoritesByUserId(userId: number): Promise<Favorites[]> {
    const user = await this.userService.getUserById(userId);

    const favorites = await this.favoritesRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    return favorites;
  }

  async toggleFavorite(userId: number, propertyId: number): Promise<void> {
    const user = await this.userService.getUserById(userId);

    const property = await this.propertyService.getPropertyById(propertyId);

    const favorite = await this.favoritesRepository.findOne({
      where: {
        user: { id: user.id },
        property: { id: property.id },
      },
    });

    if (favorite) {
      await this.favoritesRepository.remove(favorite);
    } else {
      // If the favorite doesn't exist, add it (favorite)
      const newFavorite = new Favorites();
      newFavorite.user = user;
      newFavorite.property = property;
      await this.favoritesRepository.save(newFavorite);
    }
  }
}
