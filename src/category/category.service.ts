import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CategoryService {
  constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
private readonly redisService : RedisService
  ) { }
  
  async create(createCategoryDto: CreateCategoryDto,user_id : number) {

    const category = await this.categoryRepository.findOne({where: { title: createCategoryDto.title , description: createCategoryDto.description}});
    if (category) {
      throw new BadRequestException('Category its already exists');
    }
    const newCategory = this.categoryRepository.create({...createCategoryDto,added_by:user_id});
    return await this.categoryRepository.save(newCategory);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const categoryCache = await this.redisService.client.get(`category:${id}`);
    if (categoryCache) {
      return JSON.parse(categoryCache); // Return cached category if exists
    }
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    await this.redisService.client.set(
      `category:${id}`,
      JSON.stringify(category),
      'EX',
      60,
    ); // Cache for 60 seconds
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    category.title = updateCategoryDto.title ?? category.title;
    category.description = updateCategoryDto.description ?? category.description;
    return await this.categoryRepository.save(category);
  }


  }
