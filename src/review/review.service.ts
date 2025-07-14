import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    readonly redisService: RedisService,
      ) { }
  async create(createReviewDto: CreateReviewDto, user_id: number) {
    const review = await this.reviewRepository.findOne({where:{product:{ product_id:createReviewDto.product_id}, user:{user_id:user_id}}});
    if (review) {
      throw new BadRequestException('You have already reviewed this product, please update your review instead.');
    }
    const newReview = this.reviewRepository.create({...createReviewDto, product: { product_id: createReviewDto.product_id }, user: { user_id } });
   return await this.reviewRepository.save(newReview);
  }

  findAll(product_id?: number) {
    if (product_id) {
      return this.reviewRepository.find({ where: { product: { product_id } } });
    }
    return this.reviewRepository.find();
  }

  async findOne(id: number) {
    const reviewCache = await this.redisService.client.get(`review:${id}`);
    if (reviewCache) {
      return JSON.parse(reviewCache); // Return cached review if exists
    }
    const review = await this.reviewRepository.findOne({
      where: { review_id: id },
      relations: ['product', 'user'],
    });
    if (!review) {
      throw new BadRequestException('Review not found');
    }
    await this.redisService.client.set(
      `review:${id}`,
      JSON.stringify(review),
      'EX',
      60,
    ); // Cache for 60 seconds
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    review.rating = updateReviewDto.rating ?? review.rating;
    review.comment = updateReviewDto.comment ?? review.comment;
    return await this.reviewRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return await this.reviewRepository.remove(review);
  }
}
