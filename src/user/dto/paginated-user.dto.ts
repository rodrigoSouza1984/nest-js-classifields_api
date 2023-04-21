import { CreateUserDto } from "./create-user.dto";

export class PaginatedUserDto {
    total: number;    
    users: CreateUserDto[];
}