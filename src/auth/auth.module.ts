import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { EmailSendService } from 'src/email-send/email-send.service';
import { MediaAvatarService } from 'src/user-media-avatar/media-avatar.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [forwardRef(()=>UserModule),PassportModule, TokenModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30000s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService, EmailSendService, MediaAvatarService],

  exports:  [AuthService]
})
export class AuthModule {}
