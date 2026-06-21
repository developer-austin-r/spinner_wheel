import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../database/entities';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private readonly roles: Repository<Role>) {}

  async findBySlug(slug: string) {
    return this.roles.findOneBy({ slug });
  }

  async findById(id: number) {
    return this.roles.findOneBy({ id });
  }

  async findAll() {
    return this.roles.find();
  }
}
