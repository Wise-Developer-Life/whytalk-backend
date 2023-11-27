import { Module } from '@nestjs/common';
import { MessageQueueUtils } from './message-queue.utils';
import { AppMQModule } from './rabbit-mq.setting';
import { RedisCacheModule } from './resis-cache.setting';
import { CacheUtils } from './cache.utils';

@Module({
  imports: [AppMQModule, RedisCacheModule],
  providers: [MessageQueueUtils, CacheUtils],
  exports: [MessageQueueUtils, CacheUtils],
})
export class UtilsModule {}
