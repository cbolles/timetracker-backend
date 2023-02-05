import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import mongoose from 'mongoose';

@Injectable()
export class UserPipe implements PipeTransform<string, Promise<User>> {
  constructor(private readonly userService: UserService) {}

  async transform(value: string): Promise<User> {
    try {
      const user = await this.userService.findByID(new mongoose.Types.ObjectId(value));
      if (user) {
        return user;
      }
    } catch(e: any) {}

    throw new BadRequestException(`User with id: ${value} not found`);
  }
}
