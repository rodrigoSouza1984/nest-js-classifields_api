import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserMediaAvatarEntity } from "../../user-media-avatar/entities/media-avatar.entity";
import { ProductEntity } from "src/product/entities/product.entity";

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
    dateOfBirth: string;

    @Column()
    emailCode: number;

    @Column({ default: 0 })
    qtdTryingSendEmail: number;

    @Column({ nullable: true })
    token: string

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
    typePermissionEnum: TypePermissionEnum;

    @OneToOne(() => UserMediaAvatarEntity, (mediaAvatar) => mediaAvatar.user, {
        cascade: true,
    })
    mediaAvatar: UserMediaAvatarEntity;

    @OneToMany(() => ProductEntity, (productEntity) => productEntity.user, {
        cascade: true,
    })
    products: ProductEntity[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}
