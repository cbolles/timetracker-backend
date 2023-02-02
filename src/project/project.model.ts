import { ID, ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

/** Represents a single project that a user has created */
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

/** Represents the amount of time worked on a project for a given day */
@Schema()
export class ProjectActiveTime {
  /** The project the time recording is for */
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: Project.name })
  project: mongoose.Types.ObjectId;

  /** The user whose project time this is */
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId;

  /** The day the time accumulation is for */
  @Prop()
  day: Date;

  /** The time spent on the project for the day */
  @Prop()
  time: number;
}

export type ProjectActiveTimeDocument = ProjectActiveTime & Document;
export const ProjectActiveTimeSchema = SchemaFactory.createForClass(ProjectActiveTime);

/** Represents the project the user is currently working on */
@Schema()
export class ActiveProject {
  _id: string;

  /** The project that is active */
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: Project.name })
  project: mongoose.Types.ObjectId;

  /** The user who's active project this is (for easy querying) */
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId;

  /** The timestamp when the project became active */
  @Prop()
  activeStart: Date;
}

export type ActiveProjectDocument = ActiveProject & Document;
export const ActiveProjectSchema = SchemaFactory.createForClass(ActiveProject);
