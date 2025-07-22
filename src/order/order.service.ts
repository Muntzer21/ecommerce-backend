import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { Shipping } from './entities/shipping.entity';
import { OrdersProducts } from './entities/order.products.entity';
import { ProductService } from 'src/product/product.service';
import { OrderProuctsDto } from './dto/order-products.dto';
import { Product } from 'src/product/entities/product.entity';
import { OrderStatus } from './enums/order-status';
import { UpdateOrderSatus } from './dto/update-order-status.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrdersProducts)
    private readonly opReposirty: Repository<OrdersProducts>,
    private readonly productService: ProductService,
    private readonly emailService : EmailService
  ) {}

  /**
   * create a new order
   * @param createOrderDto body of the request
   * @param user_id user id who is creating the order
   * @returns order in processing
   */
  async create(createOrderDto: CreateOrderDto, user_id: number) {
    const shipping = new Shipping();
    shipping.phone = createOrderDto.createShipping.phone;
    shipping.name = createOrderDto.createShipping.name;
    shipping.address = createOrderDto.createShipping.address;
    shipping.city = createOrderDto.createShipping.city;
    shipping.postcode = createOrderDto.createShipping.postcode;
    shipping.country = createOrderDto.createShipping.country;

    let order = new Order();
    let total = 0.0;
    order.shipping_address = shipping;
    order.added_by = user_id;
    order = await this.orderRepository.create({
      ...order,
      user: { user_id: user_id },
    });

    let products_order: OrdersProducts[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      console.log(createOrderDto.orderedProducts.length);

      const product: Product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].product_id,
      );
      // product.stock-=

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${createOrderDto.orderedProducts[i].product_id} not found.`,
        );
      }
      if (product.stock < createOrderDto.orderedProducts[i].product_quantity) {
        throw new BadRequestException(
          `the items in card its biggest than stock in products`,
        );
      }
      products_order[i] = new OrdersProducts();
      products_order[i].order = order;
      products_order[i].product = product;
      products_order[i].product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      products_order[i].product_unit_price =
        createOrderDto.orderedProducts[i].product_quantity * product.price;
      console.log(product.stock);

      total += products_order[i].product_unit_price;
    }

    const orderSave: Order = await this.orderRepository.save({
      ...order,
      totalAmount: total,
    });
    for (let product of products_order) {
      product.order = orderSave;
    }

    const op = await this.opReposirty
      .createQueryBuilder()
      .insert()
      .into(OrdersProducts)
      .values(products_order)
      .execute();

    return this.findOne(orderSave.order_id);
  }

  /**
   * to find an order by its id
   * @param id order id
   * @returns order object with its relations
   */
  findOne(id: number) {
    return this.orderRepository.findOne({
      where: {
        order_id: id,
      },
      relations: {
        shipping_address: true,
        user: true,
        products: true,
      },
    });
  }

  /**
   * to update an order status by its id
   * @param id order id
   * @param updateOrderDto update order status dto
   * @param user_id user id who is updating the order
   * @returns updated order status
   */
  async update(id: number, updateOrderDto: UpdateOrderSatus, user_id: number) {
    let order = await this.findOne(id);
    if (!order) throw new BadRequestException('the order is not found');
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CENCELLED
    )
      throw new BadRequestException('order already ' + order.status);
    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderDto.status !== OrderStatus.SHIPPED
    )
      throw new BadRequestException('delivered befor shipped!');
    if (
      updateOrderDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    )
      return order;
    if (updateOrderDto.status === OrderStatus.SHIPPED)
      order.shippedAt = new Date();
    if (updateOrderDto.status === OrderStatus.DELIVERED)
      order.deliveredAt = new Date();

    order.status = updateOrderDto.status;
    order = await this.orderRepository.save(order);

    if (updateOrderDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
      await this.emailService.sendEmail(order.user.email);
    }
    return order;
  }

  /**
   * to update products number
   * @param order to get him items
   * @param status like shipped,delevired
   */
  async stockUpdate(order: Order, status: string) {
    for (const op of order.products) {
      await this.productService.stockUpdate(
        op.product.product_id,
        op.product_quantity,
        status,
      );
    }
  }

  /**
   * to cancel order
   * @param id order id to cancelled it
   * @param user_id user that cancelled it
   * @returns order cancelled
   */
  async cancelled(id: number, user_id: number) {
    let order = await this.findOne(id);
    if (!order) {
      throw new BadRequestException('order not found');
    }
    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException('this order can not cancelled');
    }
    if (order.status === OrderStatus.CENCELLED) {
      return order;
    }
    order.status = OrderStatus.CENCELLED;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CENCELLED);
    return order;
  }

}
