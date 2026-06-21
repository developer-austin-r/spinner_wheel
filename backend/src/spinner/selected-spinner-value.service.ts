import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectedSpinnerValue } from '../database/entities';

@Injectable()
export class SelectedSpinnerValueService {
  constructor(
    @InjectRepository(SelectedSpinnerValue)
    private readonly values: Repository<SelectedSpinnerValue>,
  ) {}

  async create(data: { userId: number; selectedColor: number; amount: string; spinnerId: number }) {
    return this.values.save(this.values.create(data));
  }

  async createMany(userId: number, selections: { spinnerId: number; selectedColor: number; amount: string }[]) {
    const result = await this.values.insert(selections.map(s => ({
        ...s,
        userId,
      })));
    return { count: result.identifiers.length };
  }

  async findBySpinner(spinnerId: number) {
    return this.values.find({
      where: { spinnerId },
      relations: { color: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return this.values.createQueryBuilder('value')
      .leftJoinAndSelect('value.color', 'color')
      .leftJoin('value.user', 'user')
      .addSelect(['user.id', 'user.email'])
      .leftJoin('value.spinner', 'spinner')
      .addSelect(['spinner.id', 'spinner.spinnerName'])
      .orderBy('value.createdAt', 'DESC')
      .getMany();
  }

  async getStats() {
    const rows = await this.values.createQueryBuilder('value')
      .select('value.spinnerId', 'spinnerId')
      .addSelect('value.selectedColor', 'selectedColor')
      .addSelect('COUNT(*)', 'count')
      .groupBy('value.spinnerId')
      .addGroupBy('value.selectedColor')
      .getRawMany();

    return rows.map((row) => ({
      spinnerId: Number(row.spinnerId),
      selectedColor: Number(row.selectedColor),
      _count: { _all: Number(row.count) },
    }));
  }
}
