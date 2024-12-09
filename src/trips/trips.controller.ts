// src/trips/trips.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() trip: Partial<Trip>): Trip {
    return this.tripsService.create(trip);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Trip | undefined {
    return this.tripsService.findOne(id);
  }

  @Get()
  list(): Trip[] {
    return this.tripsService.list();
  }
}
