import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Signup, AccessToken, Login } from './auth.dto';
import { hash, compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Credentials } from './auth.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              @InjectModel(Credentials.name) private readonly credentialsModel: Model<Credentials>,
              private readonly jwtService: JwtService) {}

  async signup(userSignup: Signup): Promise<AccessToken> {
    // Make the user object
    const user = await this.userService.create({ username: userSignup.username });

    // Store the credentials (with hashed password)
    const hashedPassword = await hash(userSignup.password, 10);
    this.credentialsModel.create({ user: user._id, password: hashedPassword });

    // Return the JWT
    return { token: this.jwtService.sign(JSON.parse(JSON.stringify(user))) };
  }

  async login(userLogin: Login): Promise<AccessToken> {
    // Attempt to find the user
    const user = await this.userService.findByUsername(userLogin.username);
    if (!user) {
      throw new UnauthorizedException(`No user found with username: ${userLogin.username}`);
    }

    // Get the cooresponding credentials
    const credentials = await this.credentialsModel.findOne({ user: user._id });
    if (!credentials) {
      // Internal error, should never be a user without credentials
      throw new Error(`No credentials found for user: ${user.username}`);
    }

    // Make sure the passwords match
    if (!(await compare(userLogin.password, credentials.password))) {
      throw new UnauthorizedException('Incorrect password');
    }

    return { token: this.jwtService.sign(JSON.parse(JSON.stringify(user))) };
  }
}
