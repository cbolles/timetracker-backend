import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Signup {
  @Field({ description: 'Unique username' })
  username: string;

  @Field({ description: 'password user will use to login' })
  password: string;
}
