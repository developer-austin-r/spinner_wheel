import { Controller, Post, Body, UseGuards, Request, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SelectedSpinnerValueService } from './selected-spinner-value.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('selected-spinner-values')
export class SelectedSpinnerValueController {
  constructor(private readonly service: SelectedSpinnerValueService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any, @Request() req) {
    return this.service.create({
      ...body,
      userId: req.user.userId,
    });
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  async createBulk(@Body() body: { selections: any[] }, @Request() req) {
    return this.service.createMany(req.user.userId, body.selections);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  async findAll() {
    return this.service.findAll();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  async getStats() {
    return this.service.getStats();
  }

  @Get(':spinnerId')
  async findBySpinner(@Param('spinnerId', ParseIntPipe) spinnerId: number) {
    return this.service.findBySpinner(spinnerId);
  }
}
