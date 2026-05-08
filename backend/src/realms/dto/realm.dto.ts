import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRealmDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsBoolean()
  useDefaultMap?: boolean;
}

export class TileDeltaDto {
  added?: Record<string, any>;
  removed?: string[];
}

export class MapDeltaDto {
  tileDeltas?: Record<number, TileDeltaDto>;
  spawnpoint?: { roomIndex: number; x: number; y: number };
  rooms?: any[];
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

  @IsOptional()
  map_delta?: MapDeltaDto;
}
