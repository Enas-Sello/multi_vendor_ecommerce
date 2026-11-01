import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_ROLES, type UserRole } from './types.js';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, enum: USER_ROLES, default: 'customer' })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ select: false })
  refreshTokenHash?: string;

  @Prop({ select: false })
  refreshTokenExpiresAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
