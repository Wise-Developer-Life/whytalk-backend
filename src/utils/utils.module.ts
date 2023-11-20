import { Module } from '@nestjs/common';
import { MessageQueueUtils } from './message-queue.utils';
import { AppMQModule } from './rabbit-mq.setting';
import { RedisCacheModule } from './resis-cache.setting';

@Module({
  imports: [AppMQModule, RedisCacheModule],
  providers: [],
  exports: [MessageQueueUtils],
})
export class UtilsModule {}
