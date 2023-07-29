import { ProductMediaEntity } from "src/product-media/entities/product-media.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    postalCode: string; 

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

    @OneToMany(() => ProductMediaEntity, (productMedia) => productMedia.product,{
        cascade: true,
    })  
    @JoinColumn()  
    mediasProduct: ProductMediaEntity[];   

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
