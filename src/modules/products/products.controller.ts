import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard.js';
import { CreateCategoryDto } from './products.dto.js';
import { ProductsService } from './products.service.js';

@Controller('products')
@ApiTags('Products and Categories')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}
  @Get()
  @ApiOperation({ summary: 'List public products' })
  @ApiResponse({
    status: 200,
    description: 'Active products with category and seller names',
  })
  list() {
    return this.products.list();
  }
  @Get('categories')
  @ApiOperation({ summary: 'List public product categories' })
  @ApiResponse({ status: 200, description: 'Active product categories' })
  categories() {
    return this.products.categoriesList();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get public product details' })
  @ApiParam({ name: 'id', description: 'Product MongoDB ID' })
  @ApiResponse({
    status: 200,
    description: 'Product including category and seller names',
  })
  get(@Param('id') id: string) {
    return this.products.get(id);
  }
  @Post('categories')
  @ApiCookieAuth('access-cookie')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a product category (authenticated)' })
  @ApiResponse({ status: 201, description: 'Category created' })
  addCategory(@Body() dto: CreateCategoryDto) {
    return this.products.addCategory(dto);
  }
}
