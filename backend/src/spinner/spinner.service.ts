import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Spinner } from '../database/entities';
import { CreateSpinnerDto } from './dto/create-spinner.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpinnerService {
  constructor(
    @InjectRepository(Spinner) private readonly spinners: Repository<Spinner>,
    private configService: ConfigService,
  ) {}

  async create(createSpinnerDto: CreateSpinnerDto) {
    return this.spinners.save(this.spinners.create(createSpinnerDto));
  }

  async findAll() {
    return this.spinners.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }
}
