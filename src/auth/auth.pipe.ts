import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Signup } from './auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class UniqueUsername implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: Signup): Promise<Signup> {
    if (await this.userService.userExists(value.username)) {
      throw new BadRequestException(`User with username: ${value.username} already exists`);
    }
    return value;
  }
}
