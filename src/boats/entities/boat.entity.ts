export class Boat {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  licenseRequired: string[];
  captainShareCertificationsRequired: string[];
  ownerIds: string[];
  rateWillingToPay: number;
  preferredCaptains?: string[];
  make: string;
  model: string;
  year: number;
  color: string;
  hin?: string;
  motorDetails?: string;
  commercialUse: boolean;
  createdAt: Date;
  updatedAt: Date;
}
