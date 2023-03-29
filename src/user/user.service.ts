import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedUserDto } from './dto/paginated-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      if (createUserDto.realName === '' || createUserDto.realName === undefined) {
        throw new HttpException(`Input Field 'realName' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      if (createUserDto.userName === '' || createUserDto.userName === undefined) {
        throw new HttpException(`Input Field 'userName' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      if (createUserDto.email === '' || createUserDto.email === undefined) {
        throw new HttpException(`Input Field 'email' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      if (createUserDto.password === '' || createUserDto.password === undefined) {
        throw new HttpException(`Input Field 'password' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new HttpException(`Password and confirmPassword must to be equals!`, HttpStatus.BAD_REQUEST);
      }

      const user = new User()

      user.userName = createUserDto.userName
      user.realName = createUserDto.realName
      user.email = createUserDto.email
      user.password = bcrypt.hashSync(createUserDto.password, 8)

      return await this.userRepository.save(user);

    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        throw err
      }
    }
  }

  async getAllUsers(query: {page: number; take: number; orderBy: 'ASC' | 'DESC';}): Promise<PaginatedUserDto> {
    try {
      let { page, take, orderBy } = query;

      if (!page) page = 1;
      if (!take) take = 2;
      if (!orderBy) orderBy = 'DESC';      

      const [users, total] = await this.userRepository.findAndCount({
        skip: take * (page - 1),
        take,
        order: { id: orderBy },
      })      

      return { total, users: users };

    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        throw err
      }
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  @UseGuards(JwtAuthGuard)
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
