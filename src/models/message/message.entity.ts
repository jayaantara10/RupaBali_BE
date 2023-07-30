import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import FineArtType from "../fineArtType/fineArtType.entity";
import Chat from "../chat/chat.entity";

@Entity({name: 'message_table'})
class Message{
    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    public id: string

    @Column({name: 'chat_id', type: 'bigint', nullable: false})
    public chatId: string
    
    @Column({name: 'message', nullable: false, length: 65356})
    public message: string

    @Column({name: 'attachment', nullable: false, length: 255})
    public attachment: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @ManyToOne(() => Chat, chat => chat.message, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'chat_id'
    })
    public chat: Chat
}

export default Message