import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserStatusEnum {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum TypePermissionEnum {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    realName: string;

    @Column({ unique: true, nullable: false })
    userName: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    urlImageAvatar: string;

    @Column({ nullable: true })
    dateOfBirth: string;

    @Column()
    emailCode: number;   

    @Column({
        type: 'enum',
        enum: UserStatusEnum,
        default: UserStatusEnum.ACTIVE,
    })
    userStatus: UserStatusEnum;

    @Column({
        type: 'enum',
        enum: TypePermissionEnum,
        default: TypePermissionEnum.USER,
    })
    type: TypePermissionEnum;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}
