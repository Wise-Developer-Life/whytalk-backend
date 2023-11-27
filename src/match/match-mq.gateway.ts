import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MatchingJobMQMessage } from './match.dto';
import { MatchService } from './match.service';
import {
  MQ_EXCHANGE_CONSTANTS,
  MQ_QUEUE_CONSTANTS,
  MQ_ROUTING_KEY_CONSTANTS,
} from '../utils/rabbit-mq.constant';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class MatchMQGateway {
  constructor(
    private readonly matchingService: MatchService,
    private socketService: SocketService,
  ) {}
  @RabbitSubscribe({
    exchange: MQ_EXCHANGE_CONSTANTS.MATCHING,
    routingKey: MQ_ROUTING_KEY_CONSTANTS.MATCHING,
    queue: MQ_QUEUE_CONSTANTS.MATCHING_QUEUE,
  })
  async processMatchingJobs(message: MatchingJobMQMessage) {
    Logger.log(`process matching job for user: ${message.userId}`);
    const matchResult = await this.matchingService.processMatchingJob(
      message.userId,
    );

    if (matchResult.matchStatus === 'pending') {
      // TODO: reQueue non-matched user
      return;
    } else if (matchResult.matchStatus === 'matched') {
      // TODO: use websocket to send match result to user
    }

    //TODO: ack message
  }
}
