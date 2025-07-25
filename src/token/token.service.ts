import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TokenService {

  constructor(
    @InjectRepository(TokenEntity) private tokenRepository: Repository<TokenEntity>,
    private userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) { }

  async create(createTokenDto: CreateTokenDto) {
    const tokenExists = await this.tokenRepository.findOne({ where: { email: createTokenDto.email } })

    if (tokenExists) {
      await this.tokenRepository.save({
        ...createTokenDto,
        id: Number(tokenExists.id),
      })
    } else {
      await this.tokenRepository.save(createTokenDto)
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const tokenExists = await this.tokenRepository.findOne({ where: { hash: refreshTokenDto.oldToken } })

      if (tokenExists) {
        let user = await this.userService.findOne(tokenExists.email)

        return this.authService.login(user)
      } else {
        throw new HttpException({ errorMessage: 'Token inválido' }, HttpStatus.UNAUTHORIZED)
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

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
