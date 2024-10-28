import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SameUserGuard } from 'src/guards/same-user.guard';
import { AgentProfileService } from './agent-profile.service';
import { CreateAgentProfileDto } from './dto/create-agent-profile.dto';
import { ViewAgentProfileDto } from './dto/view-agent-profile.dto';
import { UpdateAgentProfileDto } from './dto/update-agent-profile.dto';
import { AgentProfileHelperProvider } from './agent-profile-helper.provider';

@ApiTags('agent-profile')
@Controller('users/:userId/agent-profile')
export class AgentProfileController {
  constructor(
    private readonly agentProfileService: AgentProfileService,
    private readonly agentProfileHelperProvider: AgentProfileHelperProvider
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserProfile(
    @Param('userId') userId: number
  ): Promise<ViewAgentProfileDto> {
    const agentProfile =
      await this.agentProfileService.getAgentProfileByUserId(userId);

    return this.agentProfileHelperProvider.toViewDto(agentProfile);
  }

  @Get('activate')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async activateAgentProfile(
    @Param('userId') userId: number
  ): Promise<boolean> {
    return this.agentProfileService.activate(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async createUserProfile(
    @Param('userId') userId: number,
    @Body() dto: CreateAgentProfileDto
  ): Promise<ViewAgentProfileDto> {
    const agentProfile = await this.agentProfileService.createAgentProfile(
      userId,
      dto
    );

    return this.agentProfileHelperProvider.toViewDto(agentProfile);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async updateUserProfile(
    @Param('userId') userId: number,
    @Body() dto: UpdateAgentProfileDto
  ): Promise<ViewAgentProfileDto> {
    const agentProfile =
      await this.agentProfileService.updateAgentProfileByUser(userId, dto);

    return this.agentProfileHelperProvider.toViewDto(agentProfile);
  }
}
