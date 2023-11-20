import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { FilterBody, StartMatchResponse } from './match.dto';
import { MatchService } from './match.service';
import { EmptyResponse } from '../common/common_request.dto';

// TODO: add swagger doc
@Controller('match')
export class MatchController {
  constructor(private readonly matchingService: MatchService) {}
  @Post(':/userId')
  async startMatch(
    @Param('userId') userId: string,
    @Body('filter') filter: FilterBody,
  ): Promise<StartMatchResponse> {
    await this.matchingService.createMatchingJob(userId, filter);
    return {
      message: `put user ${userId} into matching pool`,
      // TODO: think whether matching even should store matching event or not
      matchId: 'matchId',
      userId: userId,
    };
  }

  @Delete(':/userId')
  async stopMatch(@Param('userId') userId: string): Promise<EmptyResponse> {
    await this.matchingService.removeUserFromMatchingPool(userId);
    return {
      message: `remove user ${userId} from matching pool`,
    };
  }
}
