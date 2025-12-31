import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  firmware?: string;

  @IsString()
  @IsOptional()
  vineyardId?: string;

  @IsString()
  @IsOptional()
  barrelId?: string;

  @IsBoolean()
  @IsOptional()
  alertEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  recordingsEnabled?: boolean;
}

