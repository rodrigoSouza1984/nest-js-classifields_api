import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PushNotificationDataBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    message: string;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true})
    imageUrl: string;

    @Column({default: false})
    allUsers: boolean;

    @Column({ nullable: true })
    userId: number;    
    
    //ABAIXO FORMA PARA MYSQL POSTGRES QUE USO NORMALMENTE POREM FREEDATABASE TEM QUE SER DO JEITO ACIMA USADO
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}
