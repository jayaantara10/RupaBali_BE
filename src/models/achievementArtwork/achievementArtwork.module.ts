import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import AchievementArtwork from "./achievementArtwork.entity";
import { AchievementArtworkService } from "./achievementArtwork.service";
import { AchievementArtworkController } from "./achievementArtwork.controller";

@Module({
    imports: [TypeOrmModule.forFeature([AchievementArtwork])],
    controllers: [AchievementArtworkController],
    providers: [AchievementArtworkService]
})
export class AchievementArtworkModule{}