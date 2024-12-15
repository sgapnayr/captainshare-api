export class Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  revieweeRole: 'CAPTAIN' | 'OWNER';
  tripId: string;
  rating: number;
  comment: string;
  isFlagged?: boolean;
  createdAt: Date;
}
