import { Injectable } from '@nestjs/common';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  private reviews: Review[] = []; // In-memory storage

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

  // Corrected findByCaptain method
  findByCaptain(captainId: string): Review[] {
    return this.reviews.filter(
      (review) =>
        review.revieweeId === captainId && review.revieweeRole === 'CAPTAIN',
    );
  }
}
