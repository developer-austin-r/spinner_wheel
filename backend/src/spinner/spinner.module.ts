import { Module } from '@nestjs/common';
import { SpinnerService } from './spinner.service';
import { SpinnerController } from './spinner.controller';
import { SpinnerColorController } from './spinner-color.controller';
import { SelectedSpinnerValueController } from './selected-spinner-value.controller';
import { SelectedSpinnerValueService } from './selected-spinner-value.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelectedSpinnerValue, Spinner, SpinnerColor } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Spinner, SpinnerColor, SelectedSpinnerValue])],
  controllers: [SpinnerController, SpinnerColorController, SelectedSpinnerValueController],
  providers: [SpinnerService, SelectedSpinnerValueService],
  exports: [SpinnerService],
})
export class SpinnerModule {}
