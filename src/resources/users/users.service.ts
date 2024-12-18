import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';

import { User, UserProfile } from 'src/entities';
import { SecurityService } from 'src/security/security.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { AgentProfile } from 'src/entities/agent-profile.entity';
import { Role } from 'src/entities/user.entity';
import { ActivityCode } from 'src/lib/activities';

@Injectable()
export class UsersService {
  constructor(
    @Inject(User)
    private userRepository: Repository<User>,
    private readonly activityLogService: ActivityLogService, // Inject the activity log service
    private readonly securityService: SecurityService
  ) {}

  async updateUserProfile(userId: number, userProfile: UserProfile) {
    const user = await this.getUserById(userId);

    user.userProfile = userProfile;

    await this.activityLogService.createActivityLog({
      userId: user.id,
      activityCode: ActivityCode.PROFILE_UPDATE,
    });

    return this.userRepository.save(user);
  }

  async updateAgentProfile(userId: number, agentProfile: AgentProfile) {
    const user = await this.getUserById(userId);

    user.agentProfile = agentProfile;

    // await this.activityLogService.createActivityLog({
    //   userId: user.id,
    //   activityCode: ActivityCode.AGENT_PROFILE_UPDATE,
    // });

    return this.userRepository.save(user);
  }

  async updateEmail(userId: number, newEmail: string) {
    const user = await this.getUserById(userId);

    user.email = newEmail;

    await this.activityLogService.createActivityLog({
      userId: user.id,
      activityCode: ActivityCode.EMAIL_UPDATE,
    });

    return this.userRepository.save(user);
  }

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

    const newUser = await this.userRepository.save(dto);

    await this.activityLogService.createActivityLog({
      userId: newUser.id,
      activityCode: ActivityCode.REGISTRATION,
    });

    return newUser;
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      relations: {
        userProfile: true,
      },
    });

    if (!users.length) {
      throw new NotFoundException(`The list of users is empty`);
    }

    return users;
  }

  async updateUserPassword(user: User, dto: Partial<User>) {
    const updatedUser = await this.userRepository.save({
      ...user,
      ...dto,
    });

    await this.activityLogService.createActivityLog({
      userId: updatedUser.id,
      activityCode: ActivityCode.PASSWORD_CHANGE,
    });

    return updatedUser;
  }

  async softDeleteUser(userId: number): Promise<void> {
    const existingUser = await this.getUserById(userId);

    await this.userRepository.softRemove(existingUser);
    console.log(`SOFT deletion successful for user ID: ${userId}`);

    await this.activityLogService.createActivityLog({
      userId: existingUser.id,
      activityCode: ActivityCode.ACCOUNT_DEACTIVATION,
    });
  }

  async recoverUser(userId: number): Promise<User> {
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

  async updateRole(userId: number, dto: { role: string }): Promise<User> {
    const existing = await this.getUserById(userId);

    const validRole = Object.values(Role).find((e) => e === dto.role);

    if (!validRole) {
      throw new NotFoundException(`Role ${dto.role} not found`);
    }

    const updatedUser = await this.userRepository.save({
      ...existing,
      role: validRole,
    });

    // await this.activityLogService.createActivityLog({
    //   userId: updatedUser.id,
    //   activityCode: ActivityCode.ROLE_UPDATE, // role update
    // });

    return updatedUser;
  }
}
