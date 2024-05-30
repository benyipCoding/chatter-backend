import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TokenPayload } from './token-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

const COOKIE_KEY = 'Authentication';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION'),
    );

    const tokenPayload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie(COOKIE_KEY, token, {
      httpOnly: true,
      //   secure: true,
      expires,
    });
  }

  async logout(response: Response) {
    response.cookie(COOKIE_KEY, '', { httpOnly: true, expires: new Date() });
  }
}
