import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheUtils {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set<T>(setName: string, key: string, object: T, ttl?: number) {
    const keyInCache = this.generateKeyInCache(setName, key);
    await this.cacheManager.set(keyInCache, object, ttl);
  }
  async get<T>(setName: string, key: string): Promise<T> {
    const keyInCache = this.generateKeyInCache(setName, key);
    return this.cacheManager.get<T>(keyInCache);
  }

  async getKeysInSet(setName: string): Promise<string[]> {
    const cacheKeys = await this.cacheManager.store.keys(`${setName}:*`);
    return cacheKeys.map((key) => key.split(':')[1]);
  }

  async isKeyInSet(setName: string, key: string): Promise<boolean> {
    const keyInCache = this.generateKeyInCache(setName, key);
    const object = await this.cacheManager.get(keyInCache);
    return !!object;
  }

  async delete(setName: string, key: string) {
    const keyInCache = this.generateKeyInCache(setName, key);
    await this.cacheManager.del(keyInCache);
  }

  private generateKeyInCache(setName: string, key: string) {
    return `${setName}:${key}`;
  }
}
