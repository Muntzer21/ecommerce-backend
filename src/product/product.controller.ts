import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthRolesGuard } from '../user/guards/auth-roles.guard';
import { Roles } from '../user/decorators/user-role.decorator';
import { UserType } from '../utils/user-type';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { ApiOperation, ApiQuery, ApiSecurity } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Add a new product (admin only)' })
  @Post('add-product')
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user) {
    return this.productService.create(createProductDto, user.id);
  }
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  @ApiOperation({ summary: 'Get products by category' })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  @Get(':category_id')
  findAll(@Param('category_id') category_id?: number) {
    return this.productService.findAll(category_id);
  }

  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  @ApiOperation({ summary: 'Get product by ID' })
  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Update product (admin only)' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
}
