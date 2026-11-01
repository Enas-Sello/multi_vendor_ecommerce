import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

/** Product fields required from a seller when creating a listing. */
export class CreateProductDto {
  /** Product display name. */
  @IsString()
  @MinLength(1)
  name: string;

  /** Product description shown in the public catalog. */
  @IsString()
  @MinLength(1)
  description: string;

  /** Unit price; must be zero or greater. */
  @IsNumber()
  @Min(0)
  price: number;

  /** Available inventory count; must be zero or greater. */
  @IsNumber()
  @Min(0)
  stock: number;

  /** MongoDB ID of an existing category. */
  @IsMongoId()
  categoryId: string;
}

/** Product fields a seller may update. */
export class UpdateProductDto {
  /** Replacement product name. */
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  /** Replacement product description. */
  @IsOptional()
  @IsString()
  description?: string;

  /** Replacement unit price. */
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  /** Replacement inventory count. */
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  /** Replacement category ID. */
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  /** Listing visibility flag. */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/** Fields required to add a product category. */
export class CreateCategoryDto {
  /** Category display name. */
  @IsString()
  @MinLength(1)
  name: string;

  /** Optional category description. */
  @IsOptional()
  @IsString()
  description?: string;
}
