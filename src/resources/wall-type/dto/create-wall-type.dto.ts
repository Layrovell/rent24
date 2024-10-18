import { Column } from 'typeorm';

export class CreateWallTypeDto {
  @Column({ unique: true })
  code: string;

  @Column({ default: '' })
  description: string;
}
