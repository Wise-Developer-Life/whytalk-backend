import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MatchUserJobDto } from './message.dto';

@Injectable()
export class MessageQueueGateway {
  constructor() {}

  // TODO: fix any type, define incoming request type
  @RabbitSubscribe({
    exchange: 'test',
    routingKey: 'test',
    queue: 'test',
  })
  matchUser(message: MatchUserJobDto) {
    console.log('match completed: ', message);
  }
}
