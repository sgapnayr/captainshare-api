// src/boats/boats.service.ts
import { Injectable } from '@nestjs/common';
import { Boat } from './entities/boat.entity';

@Injectable()
export class BoatsService {
  private boats: Boat[] = []; // In-memory storage

  create(boat: Partial<Boat>): Boat {
    const newBoat: Boat = { ...boat, id: Date.now().toString() } as Boat; // Generate an ID
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
}
