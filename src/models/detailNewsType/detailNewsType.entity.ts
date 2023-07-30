import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import News from "../news/news.entity"
import ArtworkType from "../artworkType/artworkType.entity"

@Entity({name: 'detail_news_type_table'})
class DetailNewsType{
    @PrimaryGeneratedColumn('increment', {type: 'integer'})
    public id: string

    @Column({name: 'news_id', type: 'integer', nullable: false})
    public newsId: string

    @Column({name: 'artwork_type_id', type: 'smallint', nullable: false})
    public artworkTypeId: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @ManyToOne(() => News, news => news.detailNewsType, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'news_id'
    })
    public news: News

    @ManyToOne(() => ArtworkType, artworkType => artworkType.detailNewsType, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'artwork_type_id'
    })
    public artworkType: ArtworkType
}
export default DetailNewsType