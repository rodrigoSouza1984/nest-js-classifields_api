import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PurchaseEntity } from "./purchase.entity";

@Entity()
export class PurchaseItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    productId: number;

    @Column({ nullable: true })
    ownerUserId: number;

    @Column({ nullable: true })
    ownerName: string;// real name

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true, type: 'numeric', precision: 20, scale: 2, default: 0 })
    productPrice: number;     

    @Column({ nullable: true, default: 0, type: 'numeric', precision: 20, scale: 2 })
    discountUnitProduct: number; 
    
    @Column({ nullable: true, type: 'numeric', precision: 20, scale: 2, default: 0 })
    valuePriceWithDiscount: number;    

    // @Column({ type: 'longtext', nullable: true })//to mysql need longtext
    // urlImage: string;    

    @Column({ nullable: true })//to postgress, dont have long text
    urlImage: string;    


    @ManyToOne(() => PurchaseEntity, (purchaseEntity) => purchaseEntity.purchaseItens, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    purchase: PurchaseEntity;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}