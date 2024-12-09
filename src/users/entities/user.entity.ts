// src/users/entities/user.entity.ts
export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'CAPTAIN' | 'OWNER';
  photoUrl?: string;
  licenses?: string[];
  governmentIdUrl?: string;
  isGovernmentIdVerified: boolean;
  rating?: number;
}
