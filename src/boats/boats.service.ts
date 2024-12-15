import { Injectable, BadRequestException } from '@nestjs/common';
import { Boat } from './entities/boat.entity';
import { CreateBoatDto } from './dto/create-boat.dto';

@Injectable()
export class BoatsService {
  private boats: Boat[] = [];

  create(userId: string, boatDto: CreateBoatDto): Boat {
    const { name, make, model, year, color, commercialUse, hin } = boatDto;

    // Validate required fields
    if (!name || !make || !model || !year || !color) {
      throw new BadRequestException(
        'Name, make, model, year, and color are required.',
      );
    }

    // Validate commercial use and HIN
    if (commercialUse && !hin) {
      throw new BadRequestException('HIN is required for commercial use.');
    }

    // Check for duplicate boats
    const duplicateBoat = this.boats.find(
      (b) =>
        b.name === name &&
        b.ownerIds.includes(userId) &&
        b.make === make &&
        b.model === model &&
        b.year === year &&
        (!hin || b.hin === hin),
    );

    if (duplicateBoat) {
      console.error('Duplicate boat detected:', duplicateBoat); // Debugging log
      throw new BadRequestException(
        'A boat with similar details already exists for this owner.',
      );
    }

    // Create the new boat
    const newBoat: Boat = {
      ...boatDto,
      id: Date.now().toString(),
      ownerIds: [userId],
      createdAt: new Date(),
      updatedAt: new Date(),
      commercialUse: boatDto.commercialUse ?? false,
    };

    this.boats.push(newBoat);

    console.log('Boat created:', newBoat); // Debugging log
    return newBoat;
  }

  findOne(id: string): Boat {
    const boat = this.boats.find((boat) => boat.id === id);

    if (!boat) {
      throw new BadRequestException(`Boat with ID ${id} not found.`);
    }

    return boat;
  }

  list(): Boat[] {
    console.log('Listing all boats:', this.boats); // Debugging log
    return this.boats;
  }

  delete(id: string): boolean {
    const boatIndex = this.boats.findIndex((boat) => boat.id === id);
    if (boatIndex === -1) {
      throw new BadRequestException(`Boat with ID ${id} not found.`);
    }

    this.boats.splice(boatIndex, 1);
    console.log(`Boat with ID ${id} deleted.`); // Debugging log
    return true;
  }

  filterByCaptain(
    captainCertifications: string[],
    captainLicenses: string[],
  ): Boat[] {
    const filteredBoats = this.boats.filter((boat) => {
      const certsMatch = boat.captainShareCertificationsRequired.every((cert) =>
        captainCertifications.includes(cert),
      );
      const licensesMatch = boat.licenseRequired.every((license) =>
        captainLicenses.includes(license),
      );
      return certsMatch && licensesMatch;
    });

    console.log(`Filtered boats by captain qualifications:`, filteredBoats); // Debugging log
    return filteredBoats;
  }

  updatePreferredCaptains(boatId: string, captains: string[]): Boat {
    const boat = this.findOne(boatId);

    boat.preferredCaptains = Array.from(new Set(captains));
    boat.updatedAt = new Date();

    console.log(`Preferred captains updated for boat ${boatId}:`, captains); // Debugging log
    return boat;
  }
}
