import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SpinnerService } from './spinner.service';
import { CreateSpinnerDto } from './dto/create-spinner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('spinners')
export class SpinnerController {
  constructor(private readonly spinnerService: SpinnerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  async create(@Body() createSpinnerDto: CreateSpinnerDto, @Request() req) {
    // Optionally set user_id to current admin
    if (!createSpinnerDto.userId) {
      createSpinnerDto.userId = req.user.userId;
    }
    return this.spinnerService.create(createSpinnerDto);
  }

  @Get()
  async findAll() {
    console.log('GET /spinners reached');
    return this.spinnerService.findAll();
  }
}
