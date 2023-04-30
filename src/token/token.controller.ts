import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

//@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()  
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  @ApiOperation({
    summary: 'Return a new token valid ',
    description: `Receive a last token user and return new valid token , if old token will be valid `,
    tags: ['token'],
  })
  @Post('/refreshToken')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
    return await this.tokenService.refreshToken(refreshTokenDto)
  }
  
}
