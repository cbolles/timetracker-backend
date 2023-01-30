import { Resolver, Mutation } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {

  @Mutation(() => String)
  signup(): string {
    return 'signup';
  }

  @Mutation(() => String)
  login(): string {
    return 'login';
  }
}
