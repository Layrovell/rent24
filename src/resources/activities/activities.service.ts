import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Activities } from 'src/entities/activities.entity';
import { CreateActivitiesDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @Inject(Activities)
    private readonly activitiesRepository: Repository<Activities>
  ) {}

  async findByCode(code: string): Promise<Activities> {
    return await this.activitiesRepository.findOne({ where: { code } });
  }

  async getAll(): Promise<Activities[]> {
    return await this.activitiesRepository.find();
  }

  async create(dto: CreateActivitiesDto[]): Promise<Activities[]> {
    return await this.activitiesRepository.save(dto);
  }
}
