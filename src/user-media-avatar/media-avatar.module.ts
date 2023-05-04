import { Module } from '@nestjs/common';
import { MediaAvatarService } from './media-avatar.service';
import { MediaAvatarController } from './media-avatar.controller';

@Module({
  controllers: [MediaAvatarController],
  providers: [MediaAvatarService]
})
export class MediaAvatarModule {}
