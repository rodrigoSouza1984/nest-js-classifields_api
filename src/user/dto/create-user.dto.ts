import { MediaAvatarEntity } from "../../media-avatar/entities/media-avatar.entity";

export class CreateUserDto {    
    realName?: string;   
    userName?: string;   
    email?: string;    
    password?: string;    
    confirmPassword?: string;    
    emailCode?: number; 
    mediaAvatar?: MediaAvatarEntity;
}
