import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { OrderStatus } from 'src/order/enums/order-status';

@Injectable()
export class ProductService {
  constructor(
          @InjectRepository(Product) private readonly productRepository: Repository<Product>,
   private readonly redisService : RedisService
  ) { }
  /**
   * create new product in DB
   * @param createProductDto product body to create in DB
   * @param user_id who user that add product
   * @returns new product in DB
   */
  async create(createProductDto: CreateProductDto,user_id : number) {
    const product = await this.productRepository.findOne({ where: { title: createProductDto.title, description: createProductDto.description, category: { category_id: createProductDto.category_id } } });
   if (product) {
    throw new BadRequestException('this product already exists');
   }
   let newProduct = this.productRepository.create({...createProductDto, category: { category_id: createProductDto.category_id },added_by:user_id });
  return newProduct = await this.productRepository.save(newProduct);
  }

  /**
   * get all products
   * @param category_id category id for get all products that have same category
   * @returns products list for same category
   */
  findAll(category_id?: number) {
    if (category_id) {
      return this.productRepository.find({ where: { category: { category_id } } });
    }
    return this.productRepository.find();
  }

  /**
   * get one product
   * @param id product id 
   * @returns product from DB
   */
  async findOne(id: number) {
    const productCache = await this.redisService.client.get(`product:${id}`);
    if (productCache) {
      return JSON.parse(productCache); // Return cached product if exists
    }
    const product = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['category'],
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    await this.redisService.client.set(
      `product:${id}`,
      JSON.stringify(product),
      'EX',
      60,
    ); // Cache for 60 seconds
    return product;
  }

  /**
   * update product
   * @param id product id
   * @param updateProductDto body product for update
   * @returns update product in DB
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;
    product.stock = updateProductDto.stock ?? product.stock;
    return this.productRepository.save(product);
  }

  /**
   * update product number
   * @param id product id
   * @param stock stock product
   * @param status order stats
   * @returns update product number in DB after order
   */
  async stockUpdate(id: number, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status===OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      product.stock += stock;
      
    }
    product = await this.productRepository.save(product);
    return product;
  }

  
}
