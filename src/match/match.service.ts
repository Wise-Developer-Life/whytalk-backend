import { Injectable, Logger } from '@nestjs/common';
import { MessageQueueUtils } from '../utils/message-queue.utils';
import { CacheUtils } from '../utils/cache.utils';
import { ProfileService } from '../user/profile.service';
import { FilterBody, MatchingJobMQMessage } from './match.dto';
import { MQ_EXCHANGE_CONSTANTS } from '../utils/rabbit-mq.constant';
import * as moment from 'moment';
import { UserProfile } from '../user/profile.entity';

class MatchingResult {
  readonly matchStatus: 'matched' | 'pending' | 'skip';
  readonly matchedUserId?: string;
  readonly matchedAt?: Date;
}

class MatchingData {
  readonly userId: string;
  readonly profile: UserProfile;
  readonly filter: FilterBody;
}

@Injectable()
export class MatchService {
  constructor(
    private readonly userProfileService: ProfileService,
    private readonly queueUtils: MessageQueueUtils,
    private readonly cacheUtils: CacheUtils,
  ) {}

  async createMatchingJob(userId: string, matchingFilter: FilterBody) {
    Logger.log(`start match for user: ${userId}`);

    const profile = await this.userProfileService.getProfile(userId);
    if (!profile) {
      Logger.error(`user ${userId} not found`);
      return;
    }

    await this.cacheUtils.set<MatchingData>('matching', userId, {
      profile,
      filter: matchingFilter,
      userId,
    });

    await this.queueUtils.publishToExchange<MatchingJobMQMessage>(
      MQ_EXCHANGE_CONSTANTS.MATCHING,
      'matching',
      {
        userId,
        createdAt: moment().toDate(),
      },
    );
  }

  async processMatchingJob(userId: string): Promise<MatchingResult> {
    Logger.log(`process matching job for user: ${userId}`);

    if (!(await this.isUserInMatchingPool(userId))) {
      Logger.error(`user ${userId} not in matching status`);
      return {
        matchStatus: 'skip',
      };
    }

    const currentMatchingData = await this.cacheUtils.get<MatchingData>(
      'matching',
      userId,
    );

    const candidateIds = await this.getUsersInMatchingPool();

    for (const candidateId of candidateIds) {
      const candidateMatchingData = await this.cacheUtils.get<MatchingData>(
        'matching',
        candidateId,
      );

      const isUserMatched = await this.isTwoUsersMatch(
        currentMatchingData,
        candidateMatchingData,
      );
      if (isUserMatched) {
        await this.removeUserFromMatchingPool(userId);
        await this.removeUserFromMatchingPool(candidateId);
        return {
          matchStatus: 'matched',
          matchedUserId: candidateMatchingData.userId,
          matchedAt: moment().toDate(),
        };
      }
    }

    return {
      matchStatus: 'pending',
    };
  }

  private async isTwoUsersMatch(
    userMatchingData1: MatchingData,
    userMatchingData2: MatchingData,
  ) {
    if (userMatchingData1.userId === userMatchingData2.userId) {
      return false;
    }

    const { profile: profile1, filter: filter1 } = userMatchingData1;
    const { profile: profile2, filter: filter2 } = userMatchingData2;

    const isUser1MatchUser2 = this.isProfileMatch(profile1, filter2);
    const isUser2MatchUser1 = this.isProfileMatch(profile2, filter1);
    return isUser1MatchUser2 && isUser2MatchUser1;
  }

  private isProfileMatch(profile: UserProfile, filter: FilterBody): boolean {
    const age = profile.getAge();
    if (age < filter.ageRange.min || age > filter.ageRange.max) {
      return false;
    }
    return filter.gender.includes(profile.gender);
  }

  private async getUsersInMatchingPool() {
    return this.cacheUtils.getKeysInSet('matching');
  }

  async isUserInMatchingPool(userId: string): Promise<boolean> {
    return this.cacheUtils.isKeyInSet('matching', userId);
  }

  async removeUserFromMatchingPool(userId: string) {
    return this.cacheUtils.delete('matching', userId);
  }
}
