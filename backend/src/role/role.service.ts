import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    return this.prisma.role.findUnique({
      where: { slug },
    });
  }

  async findById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }
}
