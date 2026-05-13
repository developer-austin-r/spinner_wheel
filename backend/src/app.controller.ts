import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  getAdminData(): string {
    return 'This is admin-only data';
  }

  @Get('user-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  getUserData(): string {
    return 'This is user-only data';
  }
}
