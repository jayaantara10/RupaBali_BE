import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import News from "../news/news.entity"
import ArtworkType from "../artworkType/artworkType.entity"
import Event from "../event/event.entity"

@Entity({name: 'detail_event_type_table'})
class DetailEventType{
    @PrimaryGeneratedColumn('increment', {type: 'integer'})
    public id: string

    @Column({name: 'event_id', type: 'integer', nullable: false})
    public eventId: string

    @Column({name: 'artwork_type_id', type: 'smallint', nullable: false})
    public artworkTypeId: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @ManyToOne(() => Event, event => event.detailEventType, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'event_id'
    })
    public event: Event

    @ManyToOne(() => ArtworkType, artworkType => artworkType.detailEventType, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'news_id'
    })
    public artworkType: ArtworkType
}
export default DetailEventType