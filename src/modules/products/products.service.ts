import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema.js';
import { Category } from './category.schema.js';
import type {
  CreateCategoryDto,
  CreateProductDto,
  UpdateProductDto,
} from './products.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly products: Model<Product>,
    @InjectModel(Category.name) private readonly categories: Model<Category>,
  ) {}
  async list() {
    const products = await this.products
      .find({ isActive: true })
      .populate('categoryId', 'name')
      .populate('sellerId', 'name')
      .sort({ createdAt: -1 });
    return products.map((product) => this.productView(product));
  }
  async listBySeller(sellerId: string) {
    const products = await this.products
      .find({ sellerId })
      .populate('categoryId', 'name')
      .populate('sellerId', 'name')
      .sort({ createdAt: -1 });
    return products.map((product) => this.productView(product));
  }
  async get(id: string) {
    const product = await this.products
      .findOne({ _id: id, isActive: true })
      .populate('categoryId', 'name')
      .populate('sellerId', 'name');
    if (!product) throw new NotFoundException('Product not found');
    return this.productView(product);
  }
  categoriesList() {
    return this.categories.find({ isActive: true }).sort({ name: 1 });
  }
  async addCategory(dto: CreateCategoryDto) {
    if (await this.categories.exists({ name: dto.name.trim() }))
      throw new ConflictException('Category already exists');
    return this.categories.create(dto);
  }
  async create(sellerId: string, dto: CreateProductDto) {
    await this.ensureCategory(dto.categoryId);
    return this.products.create({ ...dto, sellerId });
  }
  async update(id: string, sellerId: string, dto: UpdateProductDto) {
    if (dto.categoryId) await this.ensureCategory(dto.categoryId);
    const p = await this.products
      .findOneAndUpdate(
        { _id: id, sellerId },
        { $set: dto },
        { new: true, runValidators: true },
      )
      .populate('categoryId');
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }
  async remove(id: string, sellerId: string) {
    const p = await this.products.findOneAndUpdate(
      { _id: id, sellerId },
      { isActive: false },
      { new: true },
    );
    if (!p) throw new NotFoundException('Product not found');
    return { id: p.id, isActive: false };
  }
  private async ensureCategory(id: string) {
    if (!(await this.categories.exists({ _id: id, isActive: true })))
      throw new NotFoundException('Category not found');
  }
  private productView(product: any) {
    const value = product.toObject();
    const categoryName = value.categoryId?.name ?? null;
    const sellerName = value.sellerId?.name ?? null;
    delete value.categoryId;
    delete value.sellerId;
    return { ...value, categoryName, sellerName };
  }
}
