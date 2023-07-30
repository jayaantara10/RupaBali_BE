import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import DetailEventType from "../detailEventType/detailEventType.entity";

@Entity({name: 'event_table'})
class Event{
    @PrimaryGeneratedColumn('increment', {type: 'integer'})
    public id: string

    @Column({name: 'event_name', nullable: false, length: 50})
    public eventName: string

    @Column({name: 'description', nullable: false, length: 500})
    public description: string

    @Column({name: 'organizer', nullable: false, length: 50})
    public organizer: string

    @Column({name: 'start_date', nullable: false})
    public startDate: Date

    @Column({name: 'end_date', nullable: false})
    public endDate: Date

    @Column({name: 'image', nullable: false, length: 255})
    public image: string

    @Column({name: 'location', nullable: false, length: 255})
    public location: string

    @Column({name: 'email_cp', nullable: false, length: 255})
    public emailCp: string

    @Column({name: 'phone_cp', nullable: false, length: 12})
    public phoneCp: string

    @Column({name: 'link_event', nullable: false, length: 255})
    public linkEvent: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date

    //Relation
    @OneToMany(() => DetailEventType, detailEventType => detailEventType.event)
    public detailEventType: DetailEventType []
}
export default Event