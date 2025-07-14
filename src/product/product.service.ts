import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ProductService {
  constructor(
          @InjectRepository(Product) private readonly productRepository: Repository<Product>,
   private readonly redisService : RedisService
  ) { }
  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.findOne({ where: { title: createProductDto.title, description: createProductDto.description, category: { category_id: createProductDto.category_id } } });
   if (product) {
    throw new BadRequestException('this product already exists');
   }
   let newProduct = this.productRepository.create({...createProductDto, category: { category_id: createProductDto.category_id } });
  return newProduct = await this.productRepository.save(newProduct);
  }

  findAll(category_id?: number) {
    if (category_id) {
      return this.productRepository.find({ where: { category: { category_id } } });
    }
    return this.productRepository.find();
  }

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

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;
    product.stock = updateProductDto.stock ?? product.stock;
    return this.productRepository.save(product);
  }

  
}
