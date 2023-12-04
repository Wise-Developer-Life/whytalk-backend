import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  providers: [ScriptService],
  exports: [ScriptService],
})
export class ScriptModule {}
