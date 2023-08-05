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

    @Column({ nullable: true })
    url: string;

    @ManyToOne(() => ProductEntity, (product) => product.mediasProduct,{
        onDelete: 'CASCADE', onUpdate:'CASCADE'
    })  
    @JoinColumn()  
    product: ProductEntity; 

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
