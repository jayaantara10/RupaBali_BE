import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import News from "../news/news.entity"
import ArtworkType from "../artworkType/artworkType.entity"
import Artwork from "../artwork/artwork.entity"
import User from "../user/user.entity"

@Entity({name: 'favorite_artwork_table'})
class FavoriteArtwork{
    @PrimaryGeneratedColumn('increment', {type: 'integer'})
    public id: string

    @Column({name: 'artwork_id', type: 'bigint', nullable: false})
    public artworkId: string

    @Column({name: 'user_id', type: 'bigint', nullable: false})
    public userId: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @ManyToOne(() => Artwork, artwork => artwork.favoriteArtwork, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'artwork_id'
    })
    public artwork: Artwork

    @ManyToOne(() => User, user =>user.favoriteArtwork, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'user_id'
    })
    public user: User
}
export default FavoriteArtwork