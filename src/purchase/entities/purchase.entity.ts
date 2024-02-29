import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PurchaseItemEntity } from "./pruchase-item.entity";

export enum TypePaymentEnum {
    BANKSLIP = 'bankSlip',
    CREDITCARD = 'creditCard',
    DEBITCARD = 'debitCard',
    PIX = 'pix'
}

@Entity()
export class PurchaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userShoppingId: number;

    @Column({ nullable: true })
    userShoppingName: string;

    @Column({ type: 'numeric', precision: 20, scale: 2, default: 0 })
    valueDiscountTotal: number;

    @Column({ default: 0, type: 'numeric', precision: 20, scale: 2 })
    valueTotal: number;

    @Column({ unique: true })
    @Generated("uuid")
    protocol: string;

    @Column({ default: 0, type: 'numeric', precision: 20, scale: 2 })
    qtdTotalItems: number;

    @Column({ default: 'waiting' })
    statusPayment: string;

    @Column({
        type: 'enum',
        enum: TypePaymentEnum,
    })
    typePaymentEnum: TypePaymentEnum;

    //case bankslip
    @Column({ nullable: true })
    urlBankslip: string

    @Column({ nullable: true })
    dueDate: string

    @Column({ nullable: true })
    formattedBarcode: string

    @Column({ nullable: true })
    barCodeWithoutFormatted?: string

    @ManyToOne(() => User, (user) => user.purchases, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    buyer: User;

    @OneToMany(() => PurchaseItemEntity, (purchaseItens) => purchaseItens.purchase, {
        cascade: true,
    })
    @JoinColumn()
    purchaseItens: PurchaseItemEntity[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}
