import { Controller, Get, Post, Body, Patch, Param, Delete, Request , Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedUserDto } from './dto/paginated-user.dto';
import { User } from './entities/user.entity';


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

  //@UseGuards(JwtAuthGuard)
  @Get(':userId')
  getUserById(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }  

  //@UseGuards(JwtAuthGuard)
  @Get('getByFilter/:userId')
  async getByFilter(@Param('userId') userId: number,@Query() query): Promise<User> {
    return await this.userService.getByFilter(userId,query)
  }

  //@UseGuards(JwtAuthGuard)
  @Patch(':userId')
  updateUser(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(':userId')
  remove(@Param('userId') userId: number) {
    return this.userService.removeUser(userId);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {    
    return this.authService.login(req.user);
  }

}
