import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true, trim: true }) name: string;
  @Prop() description?: string;
  @Prop({ default: true }) isActive: boolean;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
