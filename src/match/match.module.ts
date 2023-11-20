import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { UtilsModule } from '../utils/utils.module';
import { UserModule } from '../user/user.module';

//TODO: test on this module
@Module({
  imports: [UtilsModule, UserModule],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
