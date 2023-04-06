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


  async getAllUsers(query: { page: number; take: number; orderBy: 'ASC' | 'DESC'; }): Promise<PaginatedUserDto> {
    try {
      let { page, take, orderBy } = query;

      if (!page) page = 1;
      if (!take) take = 10;
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


  async getUserById(userId: number): Promise<User | undefined> {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: userId } });

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      return userExists

    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        throw err
      }
    }
  }


  async getByFilter(userId:number, query: any): Promise<User> {
    try {

      const userExists = await this.userRepository.findOne({ where: { id: userId } });

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      if (query.userName) {
        const userExists = await this.userRepository.findOne({ where: { userName: query.userName } })

        if (!userExists) {
          throw new HttpException(`User ${query.userName} don't found`, HttpStatus.BAD_REQUEST);
        }

        return userExists
      }
      if (query.email) {
        const userExists = await this.userRepository.findOne({ where: { email: query.email } })

        if (!userExists) {
          throw new HttpException(`User ${query.email} don't found`, HttpStatus.BAD_REQUEST);
        }

        return userExists
      }

    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        throw err
      }
    }
  }


  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      return await this.userRepository.save({
        ...updateUserDto,
        id: Number(userId),
      });

    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        throw err
      }
    }
  }


  async removeUser(userId: number) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      return await this.userRepository.delete(userId)

    } catch (err) {
      if (err.driverError) {
        return err.driverError
      } else {
        throw err
      }
    }
  }


  //FOR USE IN LOGIN AUTHSERVICE
  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email: email } });
  }
}
