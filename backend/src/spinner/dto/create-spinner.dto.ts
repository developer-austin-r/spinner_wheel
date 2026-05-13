import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateSpinnerDto {
  @IsString()
  spinnerName: string;

  @IsNumber()
  baseAmount: number;

  @IsNumber()
  setAmount: number;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsBoolean()
  @IsOptional()
  activeStatus?: boolean;
}
