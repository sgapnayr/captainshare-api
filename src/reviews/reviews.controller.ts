// src/reviews/reviews.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() review: Partial<Review>): Review {
    return this.reviewsService.create(review);
  }

  @Get('trip/:tripId')
  findByTrip(@Param('tripId') tripId: string): Review[] {
    return this.reviewsService.findByTrip(tripId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string): Review[] {
    return this.reviewsService.findByUser(userId);
  }
}
