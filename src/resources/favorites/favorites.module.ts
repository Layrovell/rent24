import { forwardRef, Module } from '@nestjs/common';

import { FavoritesService } from './favorites.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from '../users/users.module';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule), PropertyModule],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
