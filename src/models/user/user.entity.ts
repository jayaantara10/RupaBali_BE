import { UserRole } from "src/common/enum/userRole.enum";
import { VerifyStatus } from "src/common/enum/verifyStatus.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Artwork from "../artwork/artwork.entity";
import FavoriteArtwork from "../favoriteArtwork/favoriteArtwork.entity";
import Chat from "../chat/chat.entity";

@Entity({name: 'user_table'})
class User{
    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    public id: string

    @Column({name: 'full_name', nullable: false, length: 255, default: ""})
    public fullname: string

    @Column({name: 'nickname', nullable: false, length: 20, default: ""})
    public nickname: string

    @Column({name: 'username', unique: true, nullable: false, length: 30})
    public username: string

    @Column({name: 'email', unique: true, nullable: false, length: 255})
    public email: string

    @Column({name: 'password', nullable: false, length: 255})
    public password: string

    @Column({name: 'description', nullable: false, length: 150, default: ""})
    public description: string

    @Column({name: 'profile_picture', nullable: false, length: 255, default: ""})
    public profilePicture: string

    @Column({name: 'background_picture', nullable: false, length: 255, default: ""})
    public backgroundPicture: string

    @Column({name: 'role', type: 'enum', enum: UserRole, default: UserRole.VISITOR})
    public role: UserRole

    @Column({name: 'verify_status', type: 'enum', enum: VerifyStatus, default: VerifyStatus.UNVERIFY})
    public verifyStatus: VerifyStatus

    @Column({name: 'verification_note', nullable: false, length: 500, default: ""})
    public verifivcationNote: string

    @Column({name: 'identity_card', nullable: false, length: 255, default: ""})
    public identityCard: string

    @Column({name: 'is_suspend', type: 'boolean', nullable: false, default: false})
    public isSuspend: boolean

    @Column({name: 'suspend_note', nullable: false, length: 500, default: ""})
    public suspendNote: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    Relation
    @OneToMany(() => Artwork, artwork => artwork.user)
    public artwork: Artwork []

    @OneToMany(() => FavoriteArtwork, favoriteArtwork => favoriteArtwork.user)
    public favoriteArtwork: FavoriteArtwork []

    @OneToMany(() => Chat, chat => chat.sender)
    public sendedChat: Chat []

    @OneToMany(() => Chat, chat => chat.reciever)
    public recievedChat: Chat []

}
export default User