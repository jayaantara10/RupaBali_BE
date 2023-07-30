import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Artwork from "../artwork/artwork.entity";

@Entity({name: 'achievement_artwork_table'})
class AchievementArtwork{
    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    public id: string

    @Column({name: 'artwork_id', type: 'bigint', nullable: false})
    public artworkId: string

    @Column({name: 'achievement_title', nullable: false, length: 50})
    public achievementTitle: string

    @Column({name: 'documentation', nullable: false, length: 255})
    public documentation: string

    @Column({name: 'description', nullable: false, length: 500})
    public description: string

    @Column({name: 'date_achievement', nullable: false})
    public dateAchievement: Date

    @Column({name: 'certificate', nullable: false, length: 255})
    public certificate: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @ManyToOne(() => Artwork, artwork => artwork.achievementArtwork, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'artwork_id'
    })
    public artwork: Artwork
}
export default AchievementArtwork