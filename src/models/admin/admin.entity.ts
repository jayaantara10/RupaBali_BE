import { AdminRole } from "src/common/enum/adminRole.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'admin_table'})
class Admin{
    @PrimaryGeneratedColumn('increment', {type: 'integer'})
    public id: string

    @Column({name: 'nickname', nullable: false, length: 30})
    public nickname: string

    @Column({name: 'full_name', nullable: false, length: 255})
    public fullname: string

    @Column({name: 'email', unique: true, nullable: false, length: 255})
    public email: string

    @Column({name: 'password', nullable: false, length: 255})
    public password: string

    @Column({name: 'role', type: 'enum', enum: AdminRole, nullable: false})
    public role: AdminRole

    @Column({name: 'profile_picture', nullable: false, length: 255, default: ""})
    public profilePicture: string

    @Column({name: 'is_verify', type: 'boolean', nullable: false, default: false})
    public isVerify: boolean

    @Column({name: 'identity_card', nullable: false, length: 255, default: ""})
    public identityCard: string

    @Column({name: 'proving_document', nullable: false, length: 255, default: ""})
    public provingDocument: string

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date
}

export default Admin