import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthRolesGuard } from '../user/guards/auth-roles.guard';
import { Roles } from '../user/decorators/user-role.decorator';
import { UserType } from '../utils/user-type';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Post('add-product')
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user) {
    return this.productService.create(createProductDto,user.id);
  }
  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  @Get(':category_id')
  findAll(@Param('category_id') category_id?: number) {
    return this.productService.findAll(category_id);
  }

  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
}
