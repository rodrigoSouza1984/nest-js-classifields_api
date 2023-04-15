import { Module, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmailSendService } from 'src/email-send/email-send.service';
import { MediaAvatarEntity } from '../media-avatar/entities/media-avatar.entity';
import { MediaAvatarService } from 'src/media-avatar/media-avatar.service';


@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, MediaAvatarEntity]), AuthModule],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
  providers: [UserService, EmailSendService, MediaAvatarService]
})
export class UserModule {}
