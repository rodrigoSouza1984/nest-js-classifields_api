import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MediaAvatarService } from './media-avatar.service';
import { MediaAvatarDto } from './dto/media-avatar.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags,ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('media-avatar')
@Controller('media-avatar')
export class MediaAvatarController {
  constructor(private readonly mediaAvatarService: MediaAvatarService) {}

  @UseGuards(JwtAuthGuard)  
  @ApiOperation({
    summary: 'param will receive user id of avatar owner',
    description: `if user don t have avatar still, he will add avatar in user, 
    if user have avatar its make a update changing your avatar, this image file upload STORAGE and url in th data base only`,
    tags: ['media-avatar'],
  })
  @Post('/:userId')
  async create(@Param('userId') userId: number, @Body() mediaAvatarDto: MediaAvatarDto) {
    return await this.mediaAvatarService.create(userId,mediaAvatarDto);
  }    

  @UseGuards(JwtAuthGuard)   
  @ApiOperation({
    summary: 'param will receive user id avatar owner and file name media',
    description: `remove media data of data base, and remove in the STORAGE too media uploaded`,
    tags: ['media-avatar'],
  })
  @Delete('/:userId/:fileName')
  async deleteMediaAvatar(@Param('userId') userId: number, @Param('fileName') fileName: string) {
    return await this.mediaAvatarService.deleteMedia(userId,fileName);
  }
}
