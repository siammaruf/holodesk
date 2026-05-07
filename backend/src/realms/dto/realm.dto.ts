import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRealmDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsBoolean()
  useDefaultMap?: boolean;
}

export class UpdateRealmDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsBoolean()
  only_owner?: boolean;

  @IsOptional()
  map_data?: any;
}
