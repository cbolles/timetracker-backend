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


@Schema({
  timeseries: {
    timeField: 'started',
    granularity: 'minutes'
  }
})
export class ProjectActiveTime {
  /** The project the time recording is for */
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: Project.name })
  project: mongoose.Types.ObjectId

  /** The time the project was started to be worked on */
  @Prop()
  started: Date;

  /** The time the project was no longer being worked on */
  @Prop()
  stopped?: Date;
}

export type ProjectActiveTimeDocument = ProjectActiveTime & Document;
export const ProjectActiveTimeSchema = SchemaFactory.createForClass(ProjectActiveTime);
