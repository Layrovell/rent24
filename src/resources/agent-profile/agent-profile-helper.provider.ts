import { Injectable } from '@nestjs/common';

import { AgentProfile } from 'src/entities/agent-profile.entity';
import { ViewAgentProfileDto } from './dto/view-agent-profile.dto';

@Injectable()
export class AgentProfileHelperProvider {
  listToViewDto(profiles: AgentProfile[]): ViewAgentProfileDto[] {
    const viewListDto = profiles.map((profile) => this.toViewDto(profile));

    return viewListDto;
  }

  toViewDto(profile: AgentProfile): ViewAgentProfileDto {
    const viewDto = new ViewAgentProfileDto();

    viewDto.id = profile.id;
    viewDto.userId = profile.user.id;
    viewDto.title = profile.title;
    viewDto.description = profile.description;
    viewDto.commissionRate = profile.commissionRate;
    viewDto.companyName = profile.companyName;
    viewDto.fixedFee = profile.fixedFee;
    viewDto.createdAt = profile.createdAt;
    viewDto.updatedAt = profile.updatedAt;

    return viewDto;
  }
}
