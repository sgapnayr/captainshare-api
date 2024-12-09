// src/trips/trips.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Trip>,
  ): Trip | undefined {
    const updatedTrip = this.tripsService.update(id, updateData);
    if (!updatedTrip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return updatedTrip;
  }
}
