import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  skin?: string;
}

export class AddVisitedRealmDto {
  @IsString()
  shareId: string;
}
