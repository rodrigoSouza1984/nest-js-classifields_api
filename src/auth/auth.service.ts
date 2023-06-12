import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService, 
        private jwtService: JwtService,       
        private tokenService: TokenService
    ) {}

    async validarUsuario(email: string, password: string): Promise<any> {        
        const user = await this.userService.findOne(email);
        if (user && bcrypt.compareSync (password ,user.password )) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        const token = this.jwtService.sign(payload)//       

        await this.tokenService.create({email: user.email, hash: token})
        
        return {
          user,
          access_token: token,//
        };
    }
}
