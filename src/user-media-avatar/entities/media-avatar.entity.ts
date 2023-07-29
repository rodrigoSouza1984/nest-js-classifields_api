import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from '../../user/entities/user.entity'
import { isDate } from "util";

@Entity()
export class UserMediaAvatarEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    mimeType: string;

    @Column({type: 'longtext', nullable: true })
    url: string;

    @OneToOne(() => User, (user) => user.mediaAvatar,{
        onDelete: 'CASCADE', onUpdate:'CASCADE'
    })  
    @JoinColumn()  
    user: User; 

    @Column({ type: "timestamp" })  
    createdAt: Date;

    @Column({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'timestamp' })
    deletedAt: Date;

    //ABAIXO FORMA PARA MYSQL POSTGRES QUE USO NORMALMENTE POREM FREEDATABASE TEM QUE SER DO JEITO ACIMA USADO
    // @CreateDateColumn({ type: 'timestamp' })
    // createdAt: Date;

    // @UpdateDateColumn({ type: 'timestamp' })
    // updatedAt: Date;

    // @DeleteDateColumn({ type: 'timestamp' })
    // deletedAt: Date;

}