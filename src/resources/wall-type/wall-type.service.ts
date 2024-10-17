import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { WallType } from 'src/entities';
import { CreateWallTypeDto } from './dto/create-wall-type.dto';

@Injectable()
export class WallTypeService {
  constructor(
    @Inject(WallType)
    private readonly wallTypeRepository: Repository<WallType>
  ) {}

  async getAllRecords(): Promise<WallType[]> {
    return await this.wallTypeRepository.find();
  }

  async load(dto: CreateWallTypeDto[]): Promise<WallType[]> {
    return await this.wallTypeRepository.save(dto);
  }

  async getById(id: number): Promise<WallType> {
    const user = await this.wallTypeRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Wall type with the ID ${id} not found`);
    }

    return user;
  }

  async getByCode(code: string): Promise<WallType> {
    const record = await this.wallTypeRepository.findOne({
      where: { code: code as string },
    });

    if (!record) {
      throw new NotFoundException(`Wall type with the CODE ${code} not found`);
    }

    return record;
  }
}
