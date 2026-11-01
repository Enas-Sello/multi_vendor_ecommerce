import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true, min: 0 }) price: number;
  @Prop({ required: true, min: 0, default: 0 }) stock: number;
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  categoryId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  sellerId: Types.ObjectId;
  @Prop({ default: true, index: true }) isActive: boolean;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
