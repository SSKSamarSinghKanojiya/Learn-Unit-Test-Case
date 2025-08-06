import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
// import { ConstantConfig } from '../../lib/constant/constant.config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private userService: UsersService ,
              // private constant: ConstantConfig
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET
    });
  }
 async validate(payload: any) {
  try {
    if (payload.tokenType !== 'accessToken') {
      throw new UnauthorizedException('Invalid token type.');
    }

    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  } catch (error) {
    throw new UnauthorizedException('Invalid token.', {
      cause: error,
      description: error.message,
    });
  }
}
}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

 async validate(payload: any) {
  try {
    if (payload.tokenType !== 'refreshToken') {
      throw new UnauthorizedException('Invalid token type.');
    }

    const user = await this.userService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired refresh token.', {
      cause: error,
      description: error.message,
    });
  }
}
}
