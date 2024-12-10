// src/boats/boats.service.ts
import { Injectable } from '@nestjs/common';
import { Boat } from './entities/boat.entity';

@Injectable()
export class BoatsService {
  private boats: Boat[] = []; // In-memory storage

  create(boat: Partial<Boat>): Boat {
    if (!boat.name || !boat.location || !boat.rateWillingToPay) {
      throw new Error('Name, location, and rateWillingToPay are required.');
    }

    const duplicateBoat = this.boats.find(
      (b) =>
        b.name === boat.name &&
        b.ownerIds.some((id) => boat.ownerIds?.includes(id)),
    );

    if (duplicateBoat) {
      throw new Error('Boat with the same name already exists for this owner.');
    }

    const newBoat: Boat = { ...boat, id: Date.now().toString() } as Boat;
    this.boats.push(newBoat);
    return newBoat;
  }

  findOne(id: string): Boat | undefined {
    return this.boats.find((boat) => boat.id === id);
  }

  list(): Boat[] {
    return this.boats;
  }

  delete(id: string): boolean {
    const boatIndex = this.boats.findIndex((boat) => boat.id === id);
    if (boatIndex === -1) return false;

    this.boats.splice(boatIndex, 1);
    return true;
  }

  filterByCaptain(
    captainCertifications: string[],
    captainLicenses: string[],
  ): Boat[] {
    return this.boats.filter((boat) => {
      const certsMatch = boat.certificationsRequired.every((cert) =>
        captainCertifications.includes(cert),
      );
      const licensesMatch = boat.licenseRequired.every((license) =>
        captainLicenses.includes(license),
      );
      return certsMatch && licensesMatch;
    });
  }
}
