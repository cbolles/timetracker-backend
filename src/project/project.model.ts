import { ID, ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

@Schema()
@ObjectType()
export class Project {
  @Field(() => ID, { name: 'id', description: 'Unique ID of the project' })
  _id: string;

  @Prop()
  @Field({ description: 'Name of the project, unique for the user' })
  name: string;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: User.name })
  @Field(() => User, { description: 'User who created the project' })
  user: mongoose.Types.ObjectId;
}

export type ProjectDocument = Project & mongoose.Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
