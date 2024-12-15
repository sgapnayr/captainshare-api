import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  private reviews: Review[] = [];

  create(review: Partial<Review>): Review {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date(),
    } as Review;
    this.reviews.push(newReview);
    return newReview;
  }

  findByTrip(tripId: string): Review[] {
    return this.reviews.filter((review) => review.tripId === tripId);
  }

  findByUser(userId: string): Review[] {
    return this.reviews.filter((review) => review.revieweeId === userId);
  }

  findByCaptain(captainId: string): Review[] {
    return this.reviews.filter(
      (review) =>
        review.revieweeId === captainId && review.revieweeRole === 'CAPTAIN',
    );
  }

  flagReview(reviewId: string): Review {
    const review = this.reviews.find((review) => review.id === reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }
    review.isFlagged = true;
    return review;
  }
}
