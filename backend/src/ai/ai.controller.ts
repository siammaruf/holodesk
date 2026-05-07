import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('embed-realm')
  async embedRealm(@Body('realmId') realmId: string) {
    return this.aiService.embedRealm(realmId);
  }

  @Post('search')
  async search(
    @Body('query') query: string,
    @Query('limit') limit: string,
  ) {
    return this.aiService.searchRealms(query, parseInt(limit || '10', 10));
  }

  @Get('realm-suggestions/:realmId')
  async getSuggestions(@Param('realmId') realmId: string) {
    return this.aiService.getRealmSuggestions(realmId);
  }
}
