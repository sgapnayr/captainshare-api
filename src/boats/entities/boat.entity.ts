export class Boat {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  licenseRequired: string[];
  certificationsRequired: string[]; // e.g., ['USCG', 'AdvancedSailing']
  ownerIds: string[];
  rateWillingToPay: number; // Rate owners are willing to pay
}
