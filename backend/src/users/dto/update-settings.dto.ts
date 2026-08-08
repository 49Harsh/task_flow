import { Theme } from '@prisma/client';
import { IsEnum, IsHexColor, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsHexColor()
  accentColor?: string;
}