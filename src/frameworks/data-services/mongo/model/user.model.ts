import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  first_name: string;

  @Prop({ required: true, type: String })
  last_name: string;

  @Prop({ required: true, type: String })
  avatar: string;

  @Prop()
  image_path: string;

  @Prop()
  hash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
