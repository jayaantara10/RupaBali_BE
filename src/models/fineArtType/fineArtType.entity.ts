import { ValidationStatus } from "src/common/enum/validationStatus.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import ArtworkType from "../artworkType/artworkType.entity";

@Entity({name: 'fine_art_type_table'})
class FineArtType{
    @PrimaryGeneratedColumn('increment', {type: 'smallint'})
    public id: string

    @Column({name: 'type', nullable: false, length: 50})
    public type: string

    @Column({name: 'image', nullable: false, length: 255})
    public image: string

    @Column({name: 'description', nullable: false, length: 2000})
    public description: string

    @Column({name: 'validation_status', type: 'enum', enum: ValidationStatus, default: ValidationStatus.SUBMIT})
    public validationStatus: ValidationStatus

    @Column({name: 'validation_note', nullable: false, length: 500, default: ""})
    public validationNote: string
    
    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @OneToMany(() => ArtworkType, artworkType => artworkType.fineArtType)
    public artworkType: ArtworkType []
}
export default FineArtType