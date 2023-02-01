import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from '../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwtSecret')
    });
  }

  /**
   * Check to ensure the user is valid in the payload
   */
  async validate(payload: User): Promise<User> {
    const user = await this.userService.findByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException('Invalid user provided in token payload');
    }

    return user;
  }
}

