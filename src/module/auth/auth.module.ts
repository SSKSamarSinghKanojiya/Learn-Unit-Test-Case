/* eslint-disable prettier/prettier */
// auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy, JwtRefreshTokenStrategy } from './jwt.strategy';
import { JwtStrategy, JwtRefreshTokenStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy
  ],
  exports: [AuthService,JwtStrategy,JwtRefreshTokenStrategy],
})
export class AuthModule {}
