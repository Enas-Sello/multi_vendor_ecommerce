import type { HydratedDocument } from 'mongoose';
import type { Product } from './product.schema.js';

export type ProductDocument = HydratedDocument<Product>;
