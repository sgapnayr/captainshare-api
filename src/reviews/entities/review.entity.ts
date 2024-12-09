// src/reviews/entities/review.entity.ts
export class Review {
  id: string;
  reviewerId: string; // The user writing the review
  revieweeId: string; // The user being reviewed (captain or owner)
  tripId: string; // Associated trip
  rating: number; // Rating out of 5
  comment: string; // Optional comment
  createdAt: Date;
}
