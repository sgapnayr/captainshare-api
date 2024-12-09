// src/boats/entities/boat.entity.ts
export class Boat {
  id: string; // Unique ID
  name: string;
  type: string; // e.g., "Yacht", "Fishing Boat"
  capacity: number;
  licenseRequired: string[]; // List of licenses needed to operate the boat
  location: string; // Where the boat is docked
  ownerIds: string[]; // IDs of owners
}
