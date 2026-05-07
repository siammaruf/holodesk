import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Realm, RealmData } from './entities/realm.entity';

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
    const realm = this.realmRepository.create({
      owner_id: ownerId,
      name,
      share_id: uuidv4(),
      map_data: useDefaultMap ? defaultMap : { spawnpoint: { roomIndex: 0, x: 0, y: 0 }, rooms: [] },
      only_owner: false,
    });
    return this.realmRepository.save(realm);
  }

  async update(id: string, ownerId: string, data: Partial<Realm>): Promise<Realm> {
    const realm = await this.findById(id);
    if (!realm) {
      throw new NotFoundException('Realm not found');
    }
    if (realm.owner_id !== ownerId) {
      throw new ForbiddenException('Not owner of this realm');
    }
    Object.assign(realm, data);
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
