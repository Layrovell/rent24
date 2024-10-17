import { Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ActivitiesService } from './activities.service';
import { activitiesSeedData } from 'src/lib/activities';
import { Activities } from 'src/entities';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('load')
  // TODO: replace endpoint with separate script
  @ApiResponse({ status: 201, description: 'Activities loaded to the table' })
  async createActivities(): Promise<Activities[]> {
    return await this.activitiesService.create(activitiesSeedData);
  }
}
