import { Controller, Get, Post, Body, Patch, Param, Delete, Request , Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedUserDto } from './dto/paginated-user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Query() query: { page: number; take: number; orderBy: 'ASC' | 'DESC' }): Promise<PaginatedUserDto> {    
    return await this.userService.getAllUsers(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {    
    return this.authService.login(req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
