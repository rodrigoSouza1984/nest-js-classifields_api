import { User } from "../../user/entities/user.entity";

export class MediaAvatarDto {
    name?: string;
    mimeType?: string;
    url?: string;
    base64?: string      
    user?: User;     
}