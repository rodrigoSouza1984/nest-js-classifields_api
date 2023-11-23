import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class FirebaseDeviceRegisterEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: true })
    token: string;

    @OneToOne(() => User, (user) => user.firebaseDeviceRegister, {
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
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

