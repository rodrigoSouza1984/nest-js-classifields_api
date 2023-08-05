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

    // @Column({type: 'longtext', nullable: true })//to mysql need longtext
    // url: string;

    @Column({ nullable: true })//to postgress, dont have long text
    url: string;

    @OneToOne(() => User, (user) => user.mediaAvatar,{
        onDelete: 'CASCADE', onUpdate:'CASCADE'
    })  
    @JoinColumn()  
    user: User; 

    // @Column({ type: "timestamp", nullable: true })  
    // createdAt: Date;

    // @Column({ type: 'timestamp', nullable: true })
    // updatedAt: Date;

    // @Column({ type: 'timestamp', nullable: true })
    // deletedAt: Date;

    //ABAIXO FORMA PARA MYSQL POSTGRES QUE USO NORMALMENTE POREM FREEDATABASE TEM QUE SER DO JEITO ACIMA USADO
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;

}