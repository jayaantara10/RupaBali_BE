import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import User from "../user/user.entity"
import Message from "../message/message.entity"

@Entity({name: 'chat_table'})
class Chat{
    @PrimaryGeneratedColumn('increment', {type: 'integer'})
    public id: string

    @Column({name: 'sender_id', type: 'bigint', nullable: false})
    public senderId: string

    @Column({name: 'reciever_id', type: 'bigint', nullable: false})
    public recieverId: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    Relation
    @ManyToOne(() => User, user =>user.favoriteArtwork, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'sender_id'
    })
    public sender: User

    @ManyToOne(() => User, user =>user.favoriteArtwork, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'reciever_id'
    })
    public reciever: User

    @OneToMany(() => Message, message => message.chat)
    public message: Message []
}
export default Chat