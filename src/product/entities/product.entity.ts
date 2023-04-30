import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TypeProductEnum {
    FARM = 'farm',
    PARTYHALL = 'partyHall',
}

@Entity()
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    ownerRealName: string;    

    @Column({ nullable: false })
    ownerEmailContact: string;

    @Column({ nullable: false })
    ownerContactPhone: string;

    @Column({ nullable: false })
    title: string;

    @Column({ unique: true, nullable: false })
    description: string;

    @Column({ unique: true, nullable: false })
    dailyValue: string;

    @Column({ nullable: false })
    street: string;    

    @Column({ nullable: true })
    neighborhood: string;

    @Column()
    complement: string;

    @Column({ default: 0 })
    number: number;   
    
    @Column({ default: 0 })
    postalCode: number; 

    @Column({
        type: 'enum',
        enum: TypeProductEnum        
    })
    typeProductEnum: TypeProductEnum;

    @ManyToOne(() => User, (user) => user.products, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}
