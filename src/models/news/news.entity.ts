import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import DetailNewsType from "../detailNewsType/detailNewsType.entity";

@Entity({name: 'news_table'})
class News{
    @PrimaryGeneratedColumn('increment', {type: 'integer'})
    public id: string

    @Column({name: 'title', nullable: false, length: 50})
    public title: string

    @Column({name: 'date', nullable: false})
    public date: Date

    @Column({name: 'image', nullable: false, length: 255})
    public image: string

    @Column({name: 'sources', nullable: false, length: 50})
    public sources: string

    @Column({name: 'link', nullable: false, length: 255})
    public link: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @OneToMany(() => DetailNewsType, detailNewsType => detailNewsType.news)
    public detailNewsType: DetailNewsType []

}
export default News