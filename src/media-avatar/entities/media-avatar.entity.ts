import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from '../../user/entities/user.entity'

@Entity()
export class MediaAvatarEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    mimeType: string;

    @Column({ type: 'longtext', nullable: true })
    url: string;

    @OneToOne(() => User, (user) => user.mediaAvatar,{
        onDelete: 'CASCADE', onUpdate:'CASCADE'
    })  
    @JoinColumn()  
    user: User; 

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;

}