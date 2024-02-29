import { User } from "src/user/entities/user.entity";

export class CreatePurchaseDto {
    descount: number;
    priceTotal: number;
    payload: string;   
    buyer: User;
}
