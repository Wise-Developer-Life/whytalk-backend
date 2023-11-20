import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MessageQueueUtils {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishToExchange<T>(exchange: string, routingKey: string, payload: T) {
    console.log(
      `publish to exchange: ${exchange}, routingKey: ${routingKey}, payload: ${JSON.stringify(
        payload,
      )}`,
    );
    return this.amqpConnection.publish(exchange, routingKey, payload);
  }
}
