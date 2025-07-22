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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from '../user/decorators/user-role.decorator';
import { AuthRolesGuard } from '../user/guards/auth-roles.guard';
import { UserType } from '../utils/user-type';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('add-review')
  @Roles(UserType.USER)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Add a review (user only)' })
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() currentUser) {
    return this.reviewService.create(createReviewDto, currentUser.id);
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Get all reviews for a product' })
  @Get(':product_id')
  findAll(@Param('product_id') product_id: string) {
    return this.reviewService.findAll(+product_id);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Get review by ID (admin only)' })
  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Roles(UserType.USER)
  @UseGuards(AuthRolesGuard)
  @Patch(':id')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Update review (user only)' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Delete review (admin/user)' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
