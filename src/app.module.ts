import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './models/user/user.module';
import { DatabaseModule } from './providers/database/postgers/provider.module';
import { AdminModule } from './models/admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './authentication/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AdminRolesGuard } from './authentication/guards/roles.guard';
import FineArtType from './models/fineArtType/fineArtType.entity';
import { FineArtTypeModule } from './models/fineArtType/fineArtType.module';
import { ArtworkTypeModule } from './models/artworkType/artworkType.module';
import { ArtworkModule } from './models/artwork/artwork.module';
import DetailArtwork from './models/detailArtwork/detailArtwork.enity';
import { DetailArtworkModule } from './models/detailArtwork/detailArtwork.module';
import { OwnershipHistoryModule } from './models/ownershipHistory/ownershipHistory.module';
import { AchievementArtworkModule } from './models/achievementArtwork/achievementArtwork.module';
import { NewsModule } from './models/news/news.module';
import { DetailNewsTypeModule } from './models/detailNewsType/detailNewsType.module';
import { EventModule } from './models/event/event.module';
import { DetailEventTypeModule } from './models/detailEventType/detailEventType.module';
import { ChatModule } from './models/chat/chat.module';
import { MessageModule } from './models/message/message.module';
import FavoriteArtwork from './models/favoriteArtwork/favoriteArtwork.entity';
import { FavoriteArtworkModule } from './models/favoriteArtwork/favoriteArtwork.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    DatabaseModule, 
    AuthModule,
    UserModule,
    AdminModule,
    FineArtTypeModule,
    ArtworkTypeModule,
    ArtworkModule,
    DetailArtworkModule,
    OwnershipHistoryModule,
    AchievementArtworkModule,
    FavoriteArtworkModule,
    NewsModule,
    DetailNewsTypeModule,
    EventModule,
    DetailEventTypeModule,
    ChatModule,
    MessageModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
