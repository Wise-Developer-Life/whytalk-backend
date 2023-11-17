import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
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
import { ProfileImage } from './user/profile_image.entity';
import { UserProfile } from './user/profile.entity';

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
        entities: [User, UserProfile, ChatRoom, ProfileImage, ChatMessage],
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: [`./config/.env.${process.env.NODE_ENV}`],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
    }),
    ChatMessageModule,
    UserModule,
    AuthModule,
    ChatSocketModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, ChatSocketGateway],
})
export class AppModule {}
