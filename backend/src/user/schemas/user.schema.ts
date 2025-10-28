import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: String, required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
