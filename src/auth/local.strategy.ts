import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
        usernameField: 'email', //trocando o username para email
        passwordField: 'password' //passando o nome do campo para passaword
      });
    }

  async validate(email: string, password: string): Promise<any> {   
    try{
      const user = await this.authService.validarUsuario(email, password);    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
    }catch(err){
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