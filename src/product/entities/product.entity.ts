import { ProductMediaEntity } from "src/product-media/entities/product-media.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TypeProductEnum {
    FARM = 'farm',
    PARTYHALL = 'partyHall',
    HOUSE = 'house',
    APARTMENT = 'apartment'
}

export enum NeighborhoodTypeEnum {
    URBAN = 'urban',
    RURAL = 'rural'
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
    descriptionPlace: string;    

    @Column({ nullable: true , default: 'Sem Rua'})
    street: string;    

    @Column({ nullable: true, default: 'Sem Bairro' })
    neighborhood: string;

    @Column({ nullable: true })
    complement: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true, default: 'Sem Numero'})
    number: string;   
    
    @Column({ nullable: true })
    postalCode: string;    

    @Column({ nullable: true })
    descriptionPrice: string;    

    @Column({ nullable: true })
    placeName: string;

    @Column({ nullable: true })
    routePlace: string;  

    @Column({ type: 'numeric', precision: 20, scale: 2, default: 0 })
    discountItem: number;
   
    @Column({ nullable: true, default: 0, type: 'numeric', precision: 20, scale: 2 })
    price: number; 

    @Column({
        type: 'enum',
        enum: TypeProductEnum        
    })
    typeProductEnum: TypeProductEnum;

    @Column({
        type: 'enum',
        enum: NeighborhoodTypeEnum        
    })
    neighborhoodTypeEnum: NeighborhoodTypeEnum;

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
