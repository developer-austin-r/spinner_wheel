import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpinnerDto } from './dto/create-spinner.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpinnerService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(createSpinnerDto: CreateSpinnerDto) {
    return this.prisma.spinner.create({
      data: createSpinnerDto,
    });
  }

  async findAll() {
    return this.prisma.spinner.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }
}
