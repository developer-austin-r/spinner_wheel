import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SelectedSpinnerValueService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: number; selectedColor: number; amount: string; spinnerId: number }) {
    return this.prisma.selectedSpinnerValue.create({
      data,
    });
  }

  async findBySpinner(spinnerId: number) {
    return this.prisma.selectedSpinnerValue.findMany({
      where: { spinnerId },
      include: { color: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
