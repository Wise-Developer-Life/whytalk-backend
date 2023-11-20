import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MQ_EXCHANGE_CONSTANTS } from './rabbit-mq.constant';

export const AppMQModule = RabbitMQModule.forRootAsync(RabbitMQModule, {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const rabbitMqHost = configService.get<string>('RABBITMQ_URL');
    const rabbitMqPort = configService.get<number>('RABBITMQ_PORT');
    const rabbitMqUrl = `amqp://${rabbitMqHost}:${rabbitMqPort}`;
    // const mqApiVersion = configService.get<string>('MQ_API_VERSION');
    // if (!mqApiVersion) {
    //   throw new Error('MQ_API_VERSION is not defined');
    // }
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
