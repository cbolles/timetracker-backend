import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreate } from './user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  create(userCreate: UserCreate): Promise<User> {
    return this.userModel.create(userCreate);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username: username });
  }

  async userExists(username: string): Promise<boolean> {
    return (await this.findByUsername(username)) !== null;
  }
}
