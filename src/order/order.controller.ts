import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from '../user/decorators/user-role.decorator';
import { UserType } from '../utils/user-type';
import { AuthRolesGuard } from '../user/guards/auth-roles.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { UpdateOrderSatus } from './dto/update-order-status.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserType.ADMIN, UserType.USER)
  @UseGuards(AuthRolesGuard)
  @Post('create-order')
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user) {
    //  return 'its working ...';

    return this.orderService.create(createOrderDto, user.id);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderSatus,
    @CurrentUser() currentUser,
  ) {
    return this.orderService.update(+id, updateOrderDto, currentUser.id);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Patch('cancel/:id')
  cancelled(
    @Param('id') id: string,
    @CurrentUser() currentUser,
  ) {
    return this.orderService.cancelled(+id, currentUser.id);
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
