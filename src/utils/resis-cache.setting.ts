import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisCacheModule = CacheModule.registerAsync<RedisClientOptions>({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    store: redisStore,
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
  }),
});
