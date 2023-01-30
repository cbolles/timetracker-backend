import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Signup } from './auth.dto';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {

  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String, { description: 'Create a new user account' })
  signup(@Args('userSignup') userSignup: Signup): Promise<string> {
    return this.authService.signup(userSignup);
  }

  @Mutation(() => String, { description: 'Make a new login' })
  login(): string {
    return 'login';
  }
}
