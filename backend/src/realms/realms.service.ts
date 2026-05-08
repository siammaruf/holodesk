import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Realm, RealmData } from './entities/realm.entity';
import { MapDeltaDto } from './dto/realm.dto';

const defaultMap: RealmData = {
  spawnpoint: { roomIndex: 0, x: 5, y: 5 },
  rooms: [
    {
      name: 'Main Room',
      tilemap: {},
    },
  ],
};

@Injectable()
export class RealmsService {
  constructor(
    @InjectRepository(Realm)
    private readonly realmRepository: Repository<Realm>,
  ) {}

  async findById(id: string): Promise<Realm | null> {
    return this.realmRepository.findOne({ where: { id }, relations: ['owner'] });
  }

  async findByShareId(shareId: string): Promise<Realm | null> {
    return this.realmRepository.findOne({ where: { share_id: shareId }, relations: ['owner'] });
  }

  async findByOwner(ownerId: string): Promise<Realm[]> {
    return this.realmRepository.find({
      where: { owner_id: ownerId },
      select: ['id', 'name', 'share_id', 'only_owner', 'created_at'],
    });
  }

  async findByShareIds(shareIds: string[]): Promise<Realm[]> {
    if (shareIds.length === 0) return [];
    return this.realmRepository
      .createQueryBuilder('realm')
      .where('realm.share_id IN (:...shareIds)', { shareIds })
      .select(['realm.id', 'realm.name', 'realm.share_id'])
      .getMany();
  }

  async create(ownerId: string, name: string, useDefaultMap: boolean): Promise<Realm> {
    const mapData = useDefaultMap ? defaultMap : { spawnpoint: { roomIndex: 0, x: 0, y: 0 }, rooms: [] };
    if (!mapData.rooms || mapData.rooms.length === 0) {
      throw new BadRequestException('Realm must have at least one room');
    }
    const realm = this.realmRepository.create({
      owner_id: ownerId,
      name,
      share_id: uuidv4(),
      map_data: mapData,
      only_owner: false,
    });
    return this.realmRepository.save(realm);
  }

  private applyMapDelta(mapData: RealmData, delta: MapDeltaDto): RealmData {
    const result: RealmData = JSON.parse(JSON.stringify(mapData));

    if (delta.rooms) {
      result.rooms = delta.rooms;
    }

    if (delta.spawnpoint) {
      result.spawnpoint = delta.spawnpoint;
    }

    if (delta.tileDeltas) {
      for (const [roomIndexStr, roomDelta] of Object.entries(delta.tileDeltas)) {
        const roomIndex = parseInt(roomIndexStr, 10);
        if (!result.rooms[roomIndex]) continue;

        if (roomDelta.removed) {
          for (const key of roomDelta.removed) {
            delete result.rooms[roomIndex].tilemap[key];
          }
        }

        if (roomDelta.added) {
          for (const [key, tileData] of Object.entries(roomDelta.added)) {
            result.rooms[roomIndex].tilemap[key] = tileData;
          }
        }
      }
    }

    if (!result.rooms || result.rooms.length === 0) {
      throw new BadRequestException('Realm must have at least one room');
    }

    return result;
  }

  async update(id: string, ownerId: string, data: Partial<Realm> & { map_delta?: MapDeltaDto }): Promise<Realm> {
    const realm = await this.findById(id);
    if (!realm) {
      throw new NotFoundException('Realm not found');
    }
    if (realm.owner_id !== ownerId) {
      throw new ForbiddenException('Not owner of this realm');
    }

    if (data.map_delta) {
      realm.map_data = this.applyMapDelta(realm.map_data, data.map_delta);
      delete data.map_delta;
    }

    // Only assign defined properties to avoid overwriting with undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
    Object.assign(realm, cleanData);

    if (realm.map_data && (!realm.map_data.rooms || realm.map_data.rooms.length === 0)) {
      throw new BadRequestException('Realm must have at least one room');
    }

    return this.realmRepository.save(realm);
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const realm = await this.findById(id);
    if (!realm) {
      throw new NotFoundException('Realm not found');
    }
    if (realm.owner_id !== ownerId) {
      throw new ForbiddenException('Not owner of this realm');
    }
    await this.realmRepository.remove(realm);
  }

  async regenerateShareId(id: string, ownerId: string): Promise<string> {
    const realm = await this.findById(id);
    if (!realm) {
      throw new NotFoundException('Realm not found');
    }
    if (realm.owner_id !== ownerId) {
      throw new ForbiddenException('Not owner of this realm');
    }
    const newShareId = uuidv4();
    realm.share_id = newShareId;
    await this.realmRepository.save(realm);
    return newShareId;
  }
}
