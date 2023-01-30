import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Signup } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(userSignup: Signup): Promise<string> {
    this.userService.create(userSignup);
    return 'hello';
  }

}
