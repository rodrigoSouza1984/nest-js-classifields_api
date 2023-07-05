import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { PaginatedUserDto } from './dto/paginated-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserForgetPasswordDto } from './dto/update-user-forget-password.dto';
import { MediaAvatarService } from 'src/user-media-avatar/media-avatar.service';
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private mediaAvatarService: MediaAvatarService
  ) { }

  @ApiOperation({
    summary: 'Create a user account',
    description: `create a user account , 
    if sended avatar object too he add avatar, but if don't sended he create a user without avatar image, 
    if wrong err with image avatar he make user without avatar, the avatar image will upload in the 'STORAGE' and save only url in data base `,
    tags: ['user'],
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //@UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all registered users',
    description: `Get all registered users, return user list paginated`,
    tags: ['user'],
  })
  @ApiQuery({ name: 'query page', description: 'number page', required: false })
  @ApiQuery({ name: 'query take', description: 'total items returned per page', required: false })
  @Get()
  async getAllUsers(@Query() query: { page: number; take: number; orderBy: 'ASC' | 'DESC' }): Promise<PaginatedUserDto> {
    return await this.userService.getAllUsers(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Receive param: user id ',
    description: `Get user owner id sended param`,
    tags: ['user'],
  })
  @Get(':userId')
  getUserById(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }

  @ApiOperation({
    summary: 'Receive param: user name ',
    description: `Receive in the param the userName realize the get by userName, if exists already user with this user name he return 3 options name, if don't exists userName return userName sended`,
    tags: ['user'],
  })
  @Get('createUserNameUnique/:userName')
  createUserNameUnique(@Param('userName') userName: string) {
    return this.userService.createUserNameUnique(userName);
  }

  @ApiOperation({
    summary: 'Receive param: email',
    description: `Receive in the param the email realize the get by email, if exists already user with this email return true, if don't exists return false`,
    tags: ['user'],
  })
  @Get('verifyEmailExists/:email')
  async verifyEmailExists(@Param('email') email: string) {
    return await this.userService.verifyEmailExists(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Receive param : user id, query param : email or userName => url/user/userId?email=a@email.com',
    description: `Get user owner email or userName by filter query`,
    tags: ['user'],
  })
  @ApiQuery({ name: 'query userName', description: 'Filter products by name', required: false })
  @ApiQuery({ name: 'query email', description: 'Filter products by email', required: false })
  @ApiResponse({ status: 200, description: 'Return user by filter sended' })
  @Get('getByFilter/:userId')
  async getByFilter(@Param('userId') userId: number, @Query() query): Promise<User> {
    return await this.userService.getByFilter(userId, query)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'update by param : user id',
    description: `Update user data, that can to be modifications`,
    tags: ['user'],
  })
  @Patch(':userId')
  updateUser(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'remove user by param : user id',
    description: `remove user data`,
    tags: ['user'],
  })
  @Delete(':userId')
  remove(@Param('userId') userId: number) {
    return this.userService.removeUser(userId);
  }

  @ApiOperation({
    summary: 'update, and too when user forget password',
    description: `send params by body, if send password he will do update password, 
    if don't send passowrd on body he send code in the email , 
    subscribled in user account, 3 time tryed send code he return the code for show user of appropriate modo `,
    tags: ['user'],
  })
  @Post('forgetedPassword')
  forgetedPassword(@Body() data: UpdateUserForgetPasswordDto) {
    return this.userService.forgetedPassword(data);
  }

  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Compare password came by body with password registered by userId sended by param',
    description: `Method created for compare password came by body with password registered by userId sended by param, return function 
    {      
      "passwordSendedIsEqualRegistered": true
    }`,
    tags: ['user'],
  })
  @Post('comparePasswordUser/:userId')
  comparePasswordUser(@Param('userId') userId: number, @Body() data: UpdatePasswordDto) {
    return this.userService.comparePasswordUser(userId, data);
  }

  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Compare password came by body with password registered by userId sended by param',
    description: `Method created for compare password came by body with password registered by userId sended by param, return function boolean`,
    tags: ['user'],
  })
  @Post('updatePassword/:userId')
  updatePassword(@Param('userId') userId: number, @Body() data: UpdatePasswordDto) {
    return this.userService.updatePassword(userId, data);
  }

  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'realize sign in user by body params',
    description: `user send email and password, in the body params`,
    tags: ['user'],
  })
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: `Method only to see token valid yet`,
    tags: ['user'],
  })
  @Get('/token/validateToken')
  validateToken() {
    try {
      return true
    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }

  }

}
