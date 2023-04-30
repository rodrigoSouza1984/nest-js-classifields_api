import { Global, Module, forwardRef } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity]), forwardRef(()=>AuthModule)],
  exports: [TypeOrmModule, TokenService],
  controllers: [TokenController],
  providers: [TokenService]
})
export class TokenModule {}


