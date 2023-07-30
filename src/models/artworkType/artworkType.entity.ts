import { ValidationStatus } from "src/common/enum/validationStatus.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import FineArtType from "../fineArtType/fineArtType.entity";
import Artwork from "../artwork/artwork.entity";
import DetailNewsType from "../detailNewsType/detailNewsType.entity";
import DetailEventType from "../detailEventType/detailEventType.entity";

@Entity({name: 'artwork_type_table'})
class ArtworkType{
    @PrimaryGeneratedColumn('increment', {type: 'smallint'})
    public id: string

    @Column({name: 'fine_art_type_id', type: 'smallint', nullable: false})
    public fineArtTypeId: string

    @Column({name: 'type', nullable: false, length: 50})
    public type: string

    @Column({name: 'image', nullable: false, length: 255})
    public image: string;

    @Column({name: 'description', nullable: false, length: 2000})
    public description: string

    @Column({name: 'history', nullable: false, length: 2000})
    public history: string

    @Column({name: 'function', nullable: false, length: 1500})
    public function: string

    @Column({name: 'validation_status', type: 'enum', enum: ValidationStatus, default: ValidationStatus.SUBMIT})
    public validationStatus: ValidationStatus;

    @Column({name: 'validation_note', nullable: false, length: 500, default: ""})
    public validationNote: string;
    
    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @ManyToOne(() => FineArtType, fineArtType => fineArtType.artworkType, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'fine_art_type_id'
    })
    public fineArtType: FineArtType

    @OneToMany(() => Artwork, artwork => artwork.artworkType)
    public artwork: Artwork []

    @OneToMany(() => DetailNewsType, detailNewsType => detailNewsType.artworkType)
    public detailNewsType: DetailNewsType []

    @OneToMany(() => DetailEventType, detailEventType => detailEventType.artworkType)
    public detailEventType: DetailEventType []
}
export default ArtworkType