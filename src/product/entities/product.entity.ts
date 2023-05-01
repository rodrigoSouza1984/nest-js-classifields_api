import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TypeProductEnum {
    FARM = 'farm',
    PARTYHALL = 'partyHall',
    HOUSE = 'house',
    APARTMENT = 'apartment'
}

@Entity()
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    ownerRealName: string;    

    @Column({ nullable: true })
    ownerEmailContact: string;

    @Column({ nullable: true })
    ownerContactPhone: string;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    dailyValue: number;    

    @Column({ nullable: true })
    valuePerMonth: number;

    @Column({ nullable: true })
    street: string;    

    @Column({ nullable: true })
    neighborhood: string;

    @Column({ nullable: true })
    complement: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

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
