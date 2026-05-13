import { Module } from '@nestjs/common';
import { SpinnerService } from './spinner.service';
import { SpinnerController } from './spinner.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SpinnerController],
  providers: [SpinnerService, PrismaService],
  exports: [SpinnerService],
})
export class SpinnerModule {}
