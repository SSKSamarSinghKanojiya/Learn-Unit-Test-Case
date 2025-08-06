// /* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

 async validateUser(email: string, password: string): Promise<any> {
  try {
    const user = await this.userService.validateUser(email, password);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw new UnauthorizedException('User not found or password incorrect');
  }
}


  async getTokens(userId: number,email:string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          tokenType: 'accessToken',
          email:email
        },
        {
          secret:process.env.JWT_ACCESS_SECRET,
          expiresIn: '20s',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          tokenType: 'refreshToken'
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '20s',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

async validateRefreshToken(token: string): Promise<any> {
  try {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });

    if (decoded.tokenType !== 'refreshToken') {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    return decoded;
  } catch (error) {
    throw new UnauthorizedException('Refresh token is expired or invalid.');
  }
}

async refreshToken(refreshToken: string) {
  try {
    const decoded = await this.validateRefreshToken(refreshToken);
    const user = await this.userService.findUserById(decoded.sub);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // return this.getTokens(user.id);
    return "Hello"
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired refresh token.');
  }
}
}
