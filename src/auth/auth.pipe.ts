import { BadRequestException, Injectable, ValidationPipe } from '@nestjs/common';
import { Signup } from './auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class UniqueUsername extends ValidationPipe {
  constructor(private readonly userService: UserService) {
    super();
  }

  async transform(value: Signup): Promise<Signup> {
    if (await this.userService.userExists(value.username)) {
      throw new BadRequestException(`User with username: ${value.username} already exists`);
    }
    return value;
  }
}
