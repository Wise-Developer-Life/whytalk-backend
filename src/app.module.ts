import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSocketGateway } from './chat-socket/chat-socket.gateway';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { User } from './user/user.entity';
import { ChatRoom } from './chat-message/chat-room.entity';
import { ChatMessage } from './chat-message/chat-message.entity';
import { ChatSocketModule } from './chat-socket/chat-socket.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: true,
        entities: [User, ChatRoom, ChatMessage],
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: ['./config/.env'],
      isGlobal: true,
    }),
    ChatMessageModule,
    UserModule,
    AuthModule,
    ChatSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, ChatSocketGateway],
})
export class AppModule {}
