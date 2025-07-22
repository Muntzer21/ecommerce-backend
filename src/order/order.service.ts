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

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrdersProducts)
    private readonly opReposirty: Repository<OrdersProducts>,
    private readonly productService: ProductService,
    // @InjectRepository(Product)
    // readonly productRepo: Repository<Product>,
    // private dataSource: DataSource, // Inject DataSource for transactions
  ) {}
  async create(createOrderDto: CreateOrderDto, user_id: number) {
    //  await this.orderRepository.findOne({
    //       where: { order_id: orderSave.order_id },
    //       relations: ['shipping_address','user'],
    //     });

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
    order = await this.orderRepository.create({
      ...order,
      user: { user_id: user_id },
    });

    let products_order: OrdersProducts[] = [];
    // const productsToUpdate: Product[] = [];

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

      product.stock -= createOrderDto.orderedProducts[i].product_quantity;
      console.log(product.stock);

      await this.productService.update(
        createOrderDto.orderedProducts[i].product_id,
        { stock: product.stock },
      );
      // productsToUpdate.push(product);
      total += products_order[i].product_unit_price;
    }

    // await queryRunner.manager.save(Product, productsToUpdate);
    // here save products
    const orderSave: Order = await this.orderRepository.save({
      ...order,
      totalAmount: total,
    });
    // products_order.orde;
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

  findAll() {
    return `This action returns all order`;
  }

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
    // const user = await this.userService.findOne(user_id);
    // order.updatedBy = user;
    order = await this.orderRepository.save(order);

    if (updateOrderDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }
    return order;
  }

  async stockUpdate(order: Order, status: string) {
    for (const op of order.products) {
      await this.productService.stockUpdate(
        op.product.product_id,
        op.product_quantity,
        status,
      );
    }
  }

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

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
