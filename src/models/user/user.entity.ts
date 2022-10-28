import { Role } from "src/common/enum/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'user_table'})
class User{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name: 'name'})
    public name: string;

    @Column({name: 'email', unique: true})
    public email: string;

    @Column({name: 'password'})
    public description: string;

    @Column({name: 'profile_picture'})
    public profilePicture: string;

    @Column({name: 'background_picture'})
    public backgroundPicture: string;

    @Column({name: 'role', type: 'enum', enum: Role, default: Role.VISITOR})
    public role: Role;

    @Column({name: 'is_verify'})
    public isVerify: boolean;

    @Column({name: 'verification_id'})
    public verifivcationId: number;

    @CreateDateColumn({name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}