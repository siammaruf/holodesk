import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { RealmsService } from './realms.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateRealmDto, UpdateRealmDto } from './dto/realm.dto';

@Controller('realms')
export class RealmsController {
  constructor(
    private readonly realmsService: RealmsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@CurrentUser() user: any) {
    return this.realmsService.findByOwner(user.userId);
  }

  @Get('visited')
  @UseGuards(JwtAuthGuard)
  async visited(@CurrentUser() user: any) {
    const profile = await this.profilesService.findByUserId(user.userId);
    if (!profile) return [];
    const visitedIds = this.profilesService.getVisitedRealmIds(profile);
    const realms = await this.realmsService.findByShareIds(visitedIds);
    return realms.map((r) => ({ ...r, shared: true }));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: any, @Body() dto: CreateRealmDto) {
    return this.realmsService.create(
      user.userId,
      dto.name,
      dto.useDefaultMap ?? true,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@CurrentUser() user: any, @Param('id') id: string) {
    const realm = await this.realmsService.findById(id);
    if (!realm) {
      throw new Error('Realm not found');
    }
    return realm;
  }

  @Get('by-share/:shareId')
  @UseGuards(JwtAuthGuard)
  async getByShareId(@CurrentUser() user: any, @Param('shareId') shareId: string) {
    const realm = await this.realmsService.findByShareId(shareId);
    if (!realm) {
      throw new Error('Realm not found');
    }
    if (realm.only_owner && realm.owner_id !== user.userId) {
      throw new Error('only owner');
    }
    return realm;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateRealmDto,
  ) {
    return this.realmsService.update(user.userId, id, {
      name: dto.name,
      only_owner: dto.only_owner,
      map_data: dto.map_data,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    await this.realmsService.delete(id, user.userId);
    return { success: true };
  }

  @Post(':id/share')
  @UseGuards(JwtAuthGuard)
  async regenerateShareId(@CurrentUser() user: any, @Param('id') id: string) {
    const shareId = await this.realmsService.regenerateShareId(id, user.userId);
    return { share_id: shareId };
  }
}
