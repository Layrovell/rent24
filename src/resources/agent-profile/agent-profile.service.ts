import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { AgentProfile } from 'src/entities/agent-profile.entity';
import { UsersService } from '../users/users.service';
import { CreateAgentProfileDto } from './dto/create-agent-profile.dto';
import { UpdateAgentProfileDto } from './dto/update-agent-profile.dto';

@Injectable()
export class AgentProfileService {
  constructor(
    @Inject(AgentProfile)
    private agentProfileRepository: Repository<AgentProfile>,
    private readonly userService: UsersService
  ) {}

  async createAgentProfile(
    userId: number,
    dto: CreateAgentProfileDto
  ): Promise<AgentProfile> {
    const existingUserProfile = await this.agentProfileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingUserProfile) {
      throw new BadRequestException(
        `Profile for user ID ${userId} already exists`
      );
    }

    // OR await this.activate(userId); // if responce is true them move forward

    const user = await this.userService.getUserById(userId);

    const profile = this.agentProfileRepository.create({
      ...dto,
      user,
    });

    const savedProfile = await this.agentProfileRepository.save(profile);

    await this.userService.updateAgentProfile(userId, savedProfile);

    return savedProfile;
  }

  async getAgentProfileByUserId(userId: number): Promise<AgentProfile> {
    const existingAgentProfile = await this.agentProfileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!existingAgentProfile) {
      throw new NotFoundException(
        `Agent profile for user with the ID ${userId} not found`
      );
    }

    return existingAgentProfile;
  }

  async updateAgentProfileByUser(
    userId: number,
    dto: UpdateAgentProfileDto
  ): Promise<AgentProfile> {
    const existingAgentProfile = await this.getAgentProfileByUserId(userId);

    return await this.agentProfileRepository.save({
      id: existingAgentProfile.id,
      ...existingAgentProfile,
      ...dto,
    });
  }

  async activate(userId: number): Promise<boolean> {
    // const existingAgentProfile = this.getAgentProfileByUserId(userId);

    const existingAgentProfile = await this.agentProfileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (existingAgentProfile) {
      throw new BadRequestException(
        `Agent profile cannot be activated. One already exists`
      );
    }

    return true;
  }
}
