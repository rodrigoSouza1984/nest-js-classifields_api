import { ProductEntity } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ProductMediaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    mimeType: string;

    @Column({ type: 'longtext', nullable: true })
    url: string;

    @ManyToOne(() => ProductEntity, (product) => product.mediasProduct,{
        onDelete: 'CASCADE', onUpdate:'CASCADE'
    })  
    @JoinColumn()  
    product: ProductEntity; 

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}
