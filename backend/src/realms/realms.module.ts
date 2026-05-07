import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealmsService } from './realms.service';
import { RealmsController } from './realms.controller';
import { Realm } from './entities/realm.entity';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Realm]), ProfilesModule],
  controllers: [RealmsController],
  providers: [RealmsService],
  exports: [RealmsService],
})
export class RealmsModule {}
