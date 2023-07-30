import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Artwork from "../artwork/artwork.entity";

@Entity({name: 'detail_artwork_table'})
class DetailArtwork{
    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    public id: string

    @Column({name: 'artwork_id', type: 'bigint', nullable: false})
    public artworkId: string

    @Column({name: 'image', nullable: false, length: 255})
    public image: string

    @Column({name: 'description', nullable: false, length: 1500})
    public description: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    // Relation
    @ManyToOne(() => Artwork, artwork => artwork.detailArtwork, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'artwork_id'
    })
    public artwork: Artwork
}
export default DetailArtwork