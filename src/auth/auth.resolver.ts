import { Resolver, Mutation } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {

  @Mutation(() => String, { description: 'Create a new user account' })
  signup(): string {
    return 'signup';
  }

  @Mutation(() => String, { description: 'Make a new login' })
  login(): string {
    return 'login';
  }
}
