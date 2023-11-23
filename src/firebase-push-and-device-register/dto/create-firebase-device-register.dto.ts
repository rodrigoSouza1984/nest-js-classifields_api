import { User } from "src/user/entities/user.entity";

export class CreateFirebaseDeviceRegisterDto {    
    userId?: number;    
    token?: string;
    user?: User;
}