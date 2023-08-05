import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class TokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;    

    @Column({ nullable: true })
    hash: string;    

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
