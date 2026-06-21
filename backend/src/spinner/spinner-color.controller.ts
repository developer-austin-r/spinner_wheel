import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpinnerColor } from '../database/entities';

@Controller('spinner-colors')
export class SpinnerColorController {
  constructor(@InjectRepository(SpinnerColor) private readonly colors: Repository<SpinnerColor>) {}

  @Get()
  async findAll() {
    return this.colors.find();
  }
}
