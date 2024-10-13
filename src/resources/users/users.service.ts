import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager, IsNull, Not, Repository } from 'typeorm';

import { Profile, Property, User } from 'src/entities';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { SecurityService } from 'src/security/security.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityType } from 'src/entities/activity-log.entity';
import { ProfileService } from '../profile/profile.service';
import { ViewUserDto } from './dto/view-user.dto';
import { Favorites } from 'src/entities/favorites.entity';
import { CreateProfileDto } from '../profile/dto/create-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(User)
    private userRepository: Repository<User>,
    @Inject(Profile)
    private profileRepository: Repository<Profile>,
    private readonly activityLogService: ActivityLogService, // Inject the activity log service
    private readonly securityService: SecurityService,
    private readonly profileService: ProfileService,
    @Inject(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    @Inject(Property)
    private readonly propertyRepository: Repository<Property>
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with the ID ${userId} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return null;

    return user;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const oldUser = await this.getUserByEmail(dto.email);

    if (oldUser) {
      throw new BadRequestException(`Email ${dto.email} is already in use`);
    }

    // Start a transaction
    return await this.userRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        try {
          const createdUser = entityManager.create(User, dto);
          console.log('createdUser:', JSON.stringify(createdUser, null, 4));

          const savedUser = await entityManager.save(createdUser);
          console.log('savedUser:', JSON.stringify(savedUser, null, 4));

          // Create the blank profile
          const createProfileDto: CreateProfileDto = new CreateProfileDto();

          const blankProfile = entityManager.create(Profile, {
            ...createProfileDto,
            user: savedUser, // Associate the profile with the user
          });

          await entityManager.save(blankProfile);

          savedUser.profile = blankProfile;

          // Save the user again to establish the relationship
          return await entityManager.save(savedUser);
        } catch (error) {
          console.error('transaction error:', error);
          throw new InternalServerErrorException(
            'Unable to register user. Please try again later'
          );
        }
      }
    );
  }

  async getAllUsers() {
    const users = await this.userRepository.find();

    if (!users.length) {
      throw new NotFoundException(`The list of users is empty`);
    }

    return users;
  }

  async updatePassword(
    id: number,
    dto: UpdateUserPasswordDto
  ): Promise<boolean> {
    const existingUser = await this.getUserById(id);

    const isValidPassword = await this.securityService.compareData(
      dto.oldPassword,
      existingUser.hashedPassword
    );

    if (!isValidPassword) {
      throw new BadRequestException('Wrong old password');
    }

    const newHashedPassword = await this.securityService.hashData(dto.password);

    const updatedUser = await this.userRepository.save({
      ...existingUser,
      hashedPassword: newHashedPassword,
    });

    await this.activityLogService.createActivityLog(
      updatedUser,
      ActivityType.PASSWORD_CHANGE,
      'The password was changed'
    );

    return !!updatedUser;
  }

  async softDeleteUser(userId: number): Promise<void> {
    const existingUser = await this.getUserById(userId);

    await this.userRepository.softRemove(existingUser);
    console.log(`SOFT deletion successful for user ID: ${userId}`);
  }

  async recoverUser(userId: number): Promise<ViewUserDto> {
    const existingUser = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    });

    if (!existingUser) {
      throw new NotFoundException(
        `Soft-deleted user with ID ${userId} not found`
      );
    }

    // Set deletedAt back to null to recover the user
    existingUser.deletedAt = null;

    await this.userRepository.save(existingUser);
    console.log(`User ID ${userId} successfully recovered`);

    return existingUser; // Return the recovered user
  }

  async getFavorites(userId: number): Promise<Favorites[]> {
    const user = await this.getUserById(userId);

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
    const user = await this.getUserById(userId);

    const property = await this.propertyRepository.findOneBy({
      id: propertyId,
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

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
