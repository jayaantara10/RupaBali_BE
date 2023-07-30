import { ArtworkStatus } from "src/common/enum/artworkStatus.enum";
import { ValidationStatus } from "src/common/enum/validationStatus.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import ArtworkType from "../artworkType/artworkType.entity";
import User from "../user/user.entity";
import DetailArtwork from "../detailArtwork/detailArtwork.enity";
import AchievementArtwork from "../achievementArtwork/achievementArtwork.entity";
import OwnershipHistory from "../ownershipHistory/ownershipHistory.entity";
import FavoriteArtwork from "../favoriteArtwork/favoriteArtwork.entity";

@Entity({name: 'artwork_table'})
class Artwork{
    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    public id: string;

    @Column({name: 'title', nullable: false, length: 50})
    public title: string

    @Column({name: 'artist_name', nullable: false, length: 255})
    public artistName: string

    @Column({name: 'artwork_type_id', type: 'smallint', nullable: false})
    public artworkTypeId: string

    @Column({name: 'description', nullable: false, length: 2000})
    public description: string

    @Column({name: 'image', nullable: false, length: 255})
    public image: string

    @Column({name: 'artwork_video', nullable: true, length: 255})
    public artworkVideo: string

    @Column({name: 'value', nullable: false, type: 'integer'})
    public value: string

    @Column({name: 'artwork_status', type: 'enum', enum: ArtworkStatus, default: null})
    public artworkStatus: ArtworkStatus

    @Column({name: 'auction_link', nullable: false, length: 255, default: ""})
    public auctionLink: string

    @Column({name: 'creation_date', nullable: false})
    public creationDate: Date

    @Column({name: 'function', nullable: false, length: 1500})
    public function: string

    @Column({name: 'is_scared', type: 'boolean', default: false})
    public isScared: boolean

    @Column({name: 'latitude', type: 'real', nullable: false, default: 0})
    public latitude: number

    @Column({name: 'longitude', type: 'real', nullable: false, default: 0})
    public longitude: number

    @Column({name: 'dimension_hight', type: 'real', nullable: false, default: 0})
    public dimensionHight: number

    @Column({name: 'dimension_width', type: 'real', nullable: false, default: 0})
    public dimensionWidth: number

    @Column({name: 'dimension_thickness', type: 'real', nullable: false, default: 0})
    public dimensionThickness: number

    @Column({name: 'validation_status', type: 'enum', enum: ValidationStatus, default: ValidationStatus.UNVALID})
    public validationStatus: ValidationStatus;

    @Column({name: 'validation_note', nullable: false, length: 500, default: ""})
    public validationNote: string

    @Column({name: 'artwork_certificate', nullable: false, length: 255, default: ""})
    public artworkCertificate: string

    @Column({name: 'is_suspend', type: 'boolean', nullable: false, default: false})
    public isSuspend: boolean

    @Column({name: 'suspend_note', nullable: false, length: 500, default: ""})
    public suspendNote: string

    @Column({name: 'user_id', type: 'bigint', nullable: false})
    public userId: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @ManyToOne(() => ArtworkType, artworkType => artworkType.artwork, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'artwork_type_id'
    })
    public artworkType: ArtworkType

    @ManyToOne(() => User, user => user.artwork, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'user_id'
    })
    public user: User;

    @OneToMany(() => DetailArtwork, detailArtwork => detailArtwork.artwork)
    public detailArtwork: DetailArtwork []

    @OneToMany(() => AchievementArtwork, achievmentArtwork => achievmentArtwork.artwork)
    public achievementArtwork: AchievementArtwork []

    @OneToMany(() => OwnershipHistory, ownershipHistory => ownershipHistory.artwork)
    public ownershipHistory: OwnershipHistory []

    @OneToMany(() => FavoriteArtwork, favoriteArtwork => favoriteArtwork.artwork)
    public favoriteArtwork: FavoriteArtwork []

}
export default Artwork