import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { EmailSendService } from 'src/email-send/email-send.service';

@Module({
  imports: [forwardRef(()=>UserModule),PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30000s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService, EmailSendService],

  exports:  [AuthService]
})
export class AuthModule {}
