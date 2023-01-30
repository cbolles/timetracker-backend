import { ID, ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
@ObjectType()
export class User {
  @Field(() => ID, { name: 'id', description: 'Unique ID of the user' })
  _id: string;

  @Prop()
  @Field({ description: 'Username of the user, unique in the system' } )
  username: string;
}

export interface UserCreate extends Omit<User, '_id'> {}

export type UserDocument = User & mongoose.Document;
export const UserSchema = SchemaFactory.createForClass(User);
