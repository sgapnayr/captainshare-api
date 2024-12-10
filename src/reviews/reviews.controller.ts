import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() review: Partial<Review>): Review {
    return this.reviewsService.create(review);
  }

  @Get()
  findByCaptain(@Query('captainId') captainId: string): Review[] {
    const reviews = this.reviewsService.findByCaptain(captainId);
    if (!reviews.length) {
      throw new NotFoundException(
        `No reviews found for Captain ID ${captainId}`,
      );
    }
    return reviews;
  }

  @Get('trip/:tripId')
  findByTrip(@Param('tripId') tripId: string): Review[] {
    const reviews = this.reviewsService.findByTrip(tripId);
    if (!reviews.length) {
      throw new NotFoundException(`No reviews found for Trip ID ${tripId}`);
    }
    return reviews;
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string): Review[] {
    const reviews = this.reviewsService.findByUser(userId);
    if (!reviews.length) {
      throw new NotFoundException(`No reviews found for User ID ${userId}`);
    }
    return reviews;
  }
}
