import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

import * as bcrypt from 'bcrypt';
import { PaginatedUserDto } from './dto/paginated-user.dto';
import { EmailSendService } from 'src/email-send/email-send.service';

import { UpdateUserForgetPasswordDto } from './dto/update-user-forget-password.dto';
import { MediaAvatarService } from 'src/user-media-avatar/media-avatar.service';
import * as crypto from 'crypto';
import { UpdatePasswordDto } from './dto/update-password.dto';

//import { MediaAvatarService } from './media-avatar.service';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailSendService: EmailSendService,
    private mediaAvatarService: MediaAvatarService
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

      if (createUserDto.email) {
        const emailExist = await this.verifyEmailExists(createUserDto.email)

        if (emailExist === true) {
          throw new HttpException(`Email already exist, please use other in the your register`, HttpStatus.BAD_REQUEST);
        }
      }

      const user = new User()

      user.userName = createUserDto.userName
      user.realName = createUserDto.realName
      user.email = createUserDto.email
      user.dateOfBirth = createUserDto.dateOfBirth
      user.emailCode = Math.floor(Math.random() * 9000) + 1000;
      user.password = bcrypt.hashSync(createUserDto.password, 8)

      const userCreated = await this.userRepository.save(user)

      if (userCreated && createUserDto.mediaAvatar) {

        await this.mediaAvatarService.create(userCreated.id, createUserDto.mediaAvatar)

        return await this.userRepository.findOne({ where: { id: userCreated.id }, relations: ['mediaAvatar'] })

      } else {
        //console.log(userCreated)
        return userCreated
      }

      // if(userCreated){
      //   await this.emailSendService.sendEmail(user.email, {emailCode: user.emailCode, subject: 'Criação do Usuário no Apk Classifields'})
      // }     

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async verifyEmailExists(email: string) {
    try {

      const emailExists = await this.userRepository.findOne({ where: { email: email } })

      if (emailExists) {

        return true

      } else {

        return false

      }
    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async createUserNameUnique(userName: string) {//make some options to user can use how your username 
    try {

      if (userName === '' || userName === undefined) {
        throw new HttpException(`Field userName is empty`, HttpStatus.BAD_REQUEST);
      }

      const userExists = await this.userRepository.findOne({ where: { userName: userName } });

      if (userExists) {

        let namesOptions = []

        const namesGenerateds = await this.generatorUserName(userName)

        for await (const name of namesGenerateds) {
          const userExistsToo = await this.userRepository.findOne({ where: { userName: name } });

          if (!userExistsToo) {
            namesOptions.push(name)
          }
        }

        if (namesOptions.length > 0) {
          return namesOptions
        } else {
          let namesOptions = []

          const namesGenerateds = await this.generatorUserName(userName)

          for await (const name of namesGenerateds) {
            const userExistsToo = await this.userRepository.findOne({ where: { userName: name } });

            if (!userExistsToo) {
              namesOptions.push(name)
            }
            console.log(namesOptions)
            return namesOptions
          }
        }
      } else {

        let result = []

        return result = [userName]

      }

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async generatorUserName(userName: string) {
    try {

      const hash = crypto.createHash('sha256');

      let prefix1 = `${userName}`
      let timestampName1 = new Date().getTime().toString();
      hash.update(prefix1 + timestampName1)
      let codeGenerated = hash.digest('hex').substring(0, 6)

      let name1 = `${prefix1}@${codeGenerated}`;
      let name2 = `${prefix1}_${codeGenerated}`;
      let name3 = `${prefix1}${codeGenerated}`;

      return [name1, name2, name3]

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
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
        relations: ['mediaAvatar'],
        skip: take * (page - 1),
        take,
        order: { id: orderBy },
      })

      return { total, users: users };

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async getUserById(userId: number) {
    try {

      const userExists = await this.userRepository.findOne({ where: { id: userId }, relations: ['mediaAvatar'] });

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      return userExists

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async getByFilter(userId: number, query: any): Promise<User> {
    try {

      const userExists = await this.userRepository.findOne({ where: { id: userId } });

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      if (query.userName) {
        const userExists = await this.userRepository.findOne({ where: { userName: query.userName }, relations: ['mediaAvatar'] })

        if (!userExists) {
          throw new HttpException(`User ${query.userName} don't found`, HttpStatus.BAD_REQUEST);
        }

        return userExists
      }
      if (query.email) {
        const userExists = await this.userRepository.findOne({ where: { email: query.email }, relations: ['mediaAvatar'] })

        if (!userExists) {
          throw new HttpException(`User ${query.email} don't found`, HttpStatus.BAD_REQUEST);
        }

        return userExists
      }

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    try {

      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists || userId === null || userId === undefined) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      return await this.userRepository.save({
        ...updateUserDto,
        id: Number(userId),
      });

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async removeUser(userId: number) {
    try {
      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found`, HttpStatus.BAD_REQUEST);
      }

      const userDeleted = await this.userRepository.delete(userId)

      if (userDeleted) {
        return true
      } else {
        return false
      }

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async forgetedPassword(data: UpdateUserForgetPasswordDto) {//when to try 3 time send email, on 3 time return the code generate for send other form because email this bug
    try {

      if (!data.email) {
        throw new HttpException(`Email must to be send on the body`, HttpStatus.BAD_REQUEST);
      }

      const userExists = await this.findOne(data.email)

      if (!userExists) {
        throw new HttpException(`User email:${data.email} don't found`, HttpStatus.BAD_REQUEST);
      }

      const newPassword = `ab@${Math.floor(Math.random() * 9000) + 1000}`

      data.password = bcrypt.hashSync(newPassword, 8)

      let userUpdate = {
        password: data.password,
        qtdTryingSendEmail: userExists.qtdTryingSendEmail + 1
      }

      const updatePassword = await this.userRepository.save({
        ...userUpdate,
        id: Number(userExists.id),
      });

      let emailSended: boolean = false

      if (updatePassword) {
        const a = await this.emailSendService.sendEmail(
          data.email, {
          newPassword: newPassword,
          subject: 'Nova Senha Classifields',
          text: `NOVA SENHA : ${newPassword}.\n 
            Use sua nova senha, após uso se desejar troque para uma de sua escolha,\n 
            realizando uma atualização de cadastro`
        }
        ).then((r) => {
          emailSended = true
        }).catch(err => {
          console.log(err)
          emailSended = false
        })
      }

      if (userUpdate.qtdTryingSendEmail === 3) {// in 3 time try send email its return new password if front must return a push local or push firebase

        let userUpdate = {
          password: data.password,
          qtdTryingSendEmail: 0
        }

        const updatePassword = await this.userRepository.save({
          ...userUpdate,
          id: Number(userExists.id),
        });

        //return { passord: newPassword }
      }

      if (emailSended) {
        return { message: 'Email enviado com sua nova senha temporária, verifique sua caixa de span ou lixo! Caso não encontre tente novamente ou entre em contato com o suporte.' }
      } else {
        return { message: 'Humm...Aconteceu algum problema tente mais tarde ou entre em contato com o suporte,' }
      }


    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async comparePasswordUser(userId: number, data: UpdatePasswordDto) {
    try {

      if (data.password === '' || data.password === undefined) {
        throw new HttpException(`Input Field 'password' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      if (data.confirmPassword === '' || data.confirmPassword === undefined) {
        throw new HttpException(`Input Field 'confirmPassword' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found, method: comparePasswordUser`, HttpStatus.BAD_REQUEST);
      }

      if (data.password !== data.confirmPassword) {
        throw new HttpException(`Password and confirmPassword must to be equals!, method: comparePasswordUser`, HttpStatus.BAD_REQUEST);
      }

      const passwordSendedIsEqual = await bcrypt.compare(data.password, userExists.password);

      return { passwordSendedIsEqualRegistered: passwordSendedIsEqual }

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  async updatePassword(userId: number, data: UpdatePasswordDto) {
    try {

      if (data.password === '' || data.password === undefined) {
        throw new HttpException(`Input Field 'password' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      if (data.confirmPassword === '' || data.confirmPassword === undefined) {
        throw new HttpException(`Input Field 'confirmPassword' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      if (data.newPassword === '' || data.newPassword === undefined) {
        throw new HttpException(`Input Field 'newPassword' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      if (data.confirmNewPassword === '' || data.confirmNewPassword === undefined) {
        throw new HttpException(`Input Field 'confirmNewPassword' have be send, it's a field needed!`, HttpStatus.BAD_REQUEST);
      }

      const userExists = await this.userRepository.findOne({ where: { id: userId } })

      if (!userExists) {
        throw new HttpException(`User id:${userId} don't found, method: updatePassword`, HttpStatus.BAD_REQUEST);
      }

      if (data.password !== data.confirmPassword) {
        throw new HttpException(`Password and confirmPassword must to be equals!, method: updatePassword`, HttpStatus.BAD_REQUEST);
      }

      const comeparePasswordOld = await this.comparePasswordUser(userId, data)

      if (comeparePasswordOld.passwordSendedIsEqualRegistered === true) {

        if (data.newPassword !== data.confirmNewPassword) {
          throw new HttpException(`newPassword and confirmNewPassword must to be equals!, method: updatePassword`, HttpStatus.BAD_REQUEST);
        }

        let passwordUpdate = { password: bcrypt.hashSync(data.newPassword, 8) }

        const updatePassword = await this.userRepository.save({ ...passwordUpdate, id: Number(userExists.id), })

        if (updatePassword) {
          return true
        } else {
          return false
        }
      } else {
        throw new HttpException(`Password don't equal password registerede by this user userId: ${userId}, method: updatePassword`, HttpStatus.BAD_REQUEST);
      }

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }

  //FOR USE IN LOGIN AUTHSERVICE
  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email: email }, relations: ['mediaAvatar'] });
  }

  async getByFilterLike(query: {
    userName: string;
    realName: string;
    email: string
  }) {
    try {
      const { userName, realName, email } = query;

      const queryBuilder = this.userRepository.createQueryBuilder('user');

      let hasWhere = false;
      if (userName) {
        queryBuilder.where(`user.userName LIKE '%${userName.toLocaleLowerCase().toString()}%'`);
        hasWhere = true;
      }

      if (email) {
        queryBuilder.where(`user.email LIKE '%${email.toLocaleLowerCase().toString()}%'`);
        hasWhere = true;
      }

      if (realName) {
        if (hasWhere) {
          queryBuilder.orWhere(`user.realName LIKE '%${realName}%'`);
        } else {
          queryBuilder.where(`user.realName LIKE '%${realName}%'`);
        }
      }

      const a = await queryBuilder.getMany();

      return { total: a.length, users: a }

    } catch (err) {
      if (err.driverError) {
        throw new HttpException(err.driverError, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        if (err.status >= 300 && err.status < 500) {
          throw err
        } else if (err.message) {
          throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }
    }
  }


}
