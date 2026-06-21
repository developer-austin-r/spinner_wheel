import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async findByEmail(email: string) {
    return this.users.findOne({ where: { email }, relations: { role: true }, withDeleted: true });
  }

  async findById(id: number) {
    return this.users.findOne({ where: { id }, relations: { role: true }, withDeleted: true });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    roleId: number;
  }) {
    const saved = await this.users.save(
      this.users.create({
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
      }),
    );
    const user = await this.findById(saved.id);
    if (!user) {
      throw new Error('Created user could not be loaded');
    }
    return user;
  }

  async softDelete(id: number) {
    await this.users.softDelete(id);
    return this.findById(id);
  }
}
