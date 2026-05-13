import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('spinner-colors')
export class SpinnerColorController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.spinnerColor.findMany();
  }
}
