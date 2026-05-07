import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(userId: string): Promise<Profile> {
    const profile = this.profileRepository.create({
      user_id: userId,
      skin: '009',
      visited_realm_ids: '',
    });
    return this.profileRepository.save(profile);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { user_id: userId } });
  }

  async update(userId: string, data: Partial<Profile>): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    Object.assign(profile, data);
    return this.profileRepository.save(profile);
  }

  async addVisitedRealm(userId: string, shareId: string): Promise<void> {
    const profile = await this.findByUserId(userId);
    if (!profile) return;

    const visited = profile.visited_realm_ids
      ? profile.visited_realm_ids.split(',').filter(Boolean)
      : [];

    if (visited.includes(shareId)) return;

    visited.push(shareId);
    profile.visited_realm_ids = visited.join(',');
    await this.profileRepository.save(profile);
  }

  getVisitedRealmIds(profile: Profile): string[] {
    return profile.visited_realm_ids
      ? profile.visited_realm_ids.split(',').filter(Boolean)
      : [];
  }
}
