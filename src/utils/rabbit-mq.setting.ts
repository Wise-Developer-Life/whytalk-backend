import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { MQ_EXCHANGE_CONSTANTS } from './rabbit-mq.constant';

export const AppMQModule = RabbitMQModule.forRootAsync(RabbitMQModule, {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const rabbitMqHost = configService.get<string>('RABBITMQ_HOST');
    const rabbitMqPort = configService.get<number>('RABBITMQ_PORT');
    const rabbitMqUrl = `amqp://${rabbitMqHost}:${rabbitMqPort}`;
    return {
      exchanges: [
        {
          name: MQ_EXCHANGE_CONSTANTS.MATCHING,
          type: 'direct',
        },
      ],
      queues: [],
      uri: rabbitMqUrl,
    };
  },
});
