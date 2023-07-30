import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Artwork from "../artwork/artwork.entity";

@Entity({name: 'ownership_history_table'})
class OwnershipHistory{
    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    public id: string

    @Column({name: 'artwork_id', type: 'bigint', nullable: false})
    public artworkId: string

    @Column({name: 'owner_name', nullable: false, length: 255})
    public ownerName: string

    @Column({name: 'start_year', nullable: false})
    public startYear: Date

    @Column({name: 'end_year', nullable: false})
    public endYear: Date

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @ManyToOne(() => Artwork, artwork => artwork.ownershipHistory, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'artwork_id'
    })
    public artwork: Artwork
}
export default OwnershipHistory