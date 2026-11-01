import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import {
  AuthGuard,
  type AuthenticatedRequest,
} from '../../guards/auth.guard.js';
import { Roles, RolesGuard } from '../../guards/roles.guard.js';
import { ProductsService } from '../products/products.service.js';
import { CreateProductDto, UpdateProductDto } from '../products/products.dto.js';

@Controller('seller/products')
@ApiTags('Seller - Products')
@ApiCookieAuth('access-cookie')
@UseGuards(AuthGuard, RolesGuard)
@Roles('seller')
export class SellerController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'List every product created by the signed-in seller',
  })
  @ApiResponse({ status: 200, description: 'Products owned by the current seller' })
  myProducts(@Req() req: Request) {
    return this.products.listBySeller((req as AuthenticatedRequest).user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Product created' })
  create(@Req() req: Request, @Body() dto: CreateProductDto) {
    return this.products.create((req as AuthenticatedRequest).user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product owned by the signed-in seller' })
  @ApiParam({ name: 'id', description: 'Product MongoDB ID' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateProductDto,
  ) {
    return this.products.update(
      id,
      (req as AuthenticatedRequest).user.sub,
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deactivate a product owned by the signed-in seller',
  })
  @ApiParam({ name: 'id', description: 'Product MongoDB ID' })
  @ApiResponse({ status: 200, description: 'Product deactivated' })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.products.remove(id, (req as AuthenticatedRequest).user.sub);
  }
}
