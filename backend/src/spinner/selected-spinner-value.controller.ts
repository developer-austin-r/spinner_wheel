import { Controller, Post, Body, UseGuards, Request, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SelectedSpinnerValueService } from './selected-spinner-value.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @Get(':spinnerId')
  async findBySpinner(@Param('spinnerId', ParseIntPipe) spinnerId: number) {
    return this.service.findBySpinner(spinnerId);
  }
}
