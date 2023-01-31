import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AccessToken, Login, Signup } from './auth.dto';
import { AuthService } from './auth.service';
import { UniqueUsername } from './auth.pipe';

@Resolver()
export class AuthResolver {

  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AccessToken, { description: 'Create a new user account' })
  signup(@Args('userSignup', UniqueUsername) userSignup: Signup): Promise<AccessToken> {
    return this.authService.signup(userSignup);
  }

  @Mutation(() => AccessToken, { description: 'Login via username and password' })
  login(@Args('login') login: Login): Promise<AccessToken> {
    return this.authService.login(login);
  }
}
