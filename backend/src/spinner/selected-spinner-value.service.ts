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

  async createMany(userId: number, selections: { spinnerId: number; selectedColor: number; amount: string }[]) {
    return this.prisma.selectedSpinnerValue.createMany({
      data: selections.map(s => ({
        ...s,
        userId,
      })),
    });
  }

  async findBySpinner(spinnerId: number) {
    return this.prisma.selectedSpinnerValue.findMany({
      where: { spinnerId },
      include: { color: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.selectedSpinnerValue.findMany({
      include: { 
        color: true,
        user: { select: { email: true, id: true } },
        spinner: { select: { spinnerName: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    return this.prisma.selectedSpinnerValue.groupBy({
      by: ['spinnerId', 'selectedColor'],
      _count: {
        _all: true
      }
    });
  }
}
