import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto, AddVisitedRealmDto } from './dto/profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    const profile = await this.profilesService.findByUserId(user.userId);
    if (!profile) {
      return null;
    }
    return {
      user_id: profile.user_id,
      skin: profile.skin,
      visited_realm_ids: this.profilesService.getVisitedRealmIds(profile),
    };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    const profile = await this.profilesService.update(user.userId, {
      skin: dto.skin,
    });
    return {
      user_id: profile.user_id,
      skin: profile.skin,
      visited_realm_ids: this.profilesService.getVisitedRealmIds(profile),
    };
  }

  @Post('visited-realms')
  @UseGuards(JwtAuthGuard)
  async addVisitedRealm(@CurrentUser() user: any, @Body() dto: AddVisitedRealmDto) {
    await this.profilesService.addVisitedRealm(user.userId, dto.shareId);
    return { success: true };
  }
}
