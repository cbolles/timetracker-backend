import { Schema, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/user.model';

@Schema()
export class Credentials {
  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId;

  @Prop()
  password: string;
}
