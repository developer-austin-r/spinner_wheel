import { Module } from '@nestjs/common';
import { SpinnerService } from './spinner.service';
import { SpinnerController } from './spinner.controller';
import { SpinnerColorController } from './spinner-color.controller';
import { SelectedSpinnerValueController } from './selected-spinner-value.controller';
import { SelectedSpinnerValueService } from './selected-spinner-value.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SpinnerController, SpinnerColorController, SelectedSpinnerValueController],
  providers: [SpinnerService, SelectedSpinnerValueService, PrismaService],
  exports: [SpinnerService],
})
export class SpinnerModule {}
