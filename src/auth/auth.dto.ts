import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ description: 'Required information to signup' })
export class Signup {
  @Field({ description: 'Unique username' })
  username: string;

  @Field({ description: 'password user will use to login' })
  password: string;
}

@ObjectType()
export class AccessToken {
  @Field({ description: 'JWT Access Token' })
  token: string;
}

@InputType({ description: 'Required information to loging' })
export class Login {
  @Field({ description: 'Username to login with' })
  username: string;

  @Field({ description: 'Password used during signup' })
  password: string;
}
