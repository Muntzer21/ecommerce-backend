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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../user/decorators/user-role.decorator';
import { UserType } from '../utils/user-type';
import { AuthRolesGuard } from '../user/guards/auth-roles.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Add a new category (admin only)' })
  @Post('add-category')
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user) {
    return this.categoryService.create(createCategoryDto, user.id);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiOperation({ summary: 'Get all categories (admin only)' })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiOperation({ summary: 'Get category by ID (admin only)' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Update category (admin only)' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }
}
