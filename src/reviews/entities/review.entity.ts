export class Review {
  id: string;
  reviewerId: string; // The user writing the review
  revieweeId: string; // The user being reviewed
  revieweeRole: 'CAPTAIN' | 'OWNER'; // Role of the reviewee
  tripId: string; // Associated trip
  rating: number; // Rating out of 5
  comment: string; // Optional comment
  createdAt: Date;
}
