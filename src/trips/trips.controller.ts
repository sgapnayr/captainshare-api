import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  NotFoundException,
  Delete,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';
import {
  DEFAULT_TRIP_TYPE,
  DEFAULT_TOTAL_PRICE,
  DEFAULT_CAPTAIN_RATE,
  DEFAULT_CAPTAIN_SHARE,
} from './trips.constants';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() tripDto: Partial<Trip>): Trip {
    try {
      const trip = {
        ...tripDto,
        startTime: new Date(tripDto.startTime!),
        endTime: new Date(tripDto.endTime!),
        tripType: tripDto.tripType || DEFAULT_TRIP_TYPE,
        totalPrice: tripDto.totalPrice || DEFAULT_TOTAL_PRICE,
        captainRate: tripDto.captainRate || DEFAULT_CAPTAIN_RATE,
        captainShare: tripDto.captainShare || DEFAULT_CAPTAIN_SHARE,
      };
      return this.tripsService.create(trip);
    } catch (error) {
      if (error.message.includes('already booked')) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the trip.',
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string): Trip {
    const trip = this.tripsService.findOne(id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found.`);
    }
    return trip;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Trip>): Trip {
    const trip = this.tripsService.update(id, updateData);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found.`);
    }
    return trip;
  }

  @Get()
  list(): Trip[] {
    return this.tripsService.list();
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    const trip = this.tripsService.findOne(id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found.`);
    }
    this.tripsService.delete(id);
  }
}
