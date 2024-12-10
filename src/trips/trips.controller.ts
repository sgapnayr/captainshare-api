import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() tripDto: Partial<Trip>): Trip {
    const trip = {
      ...tripDto,
      startTime: new Date(tripDto.startTime),
      endTime: new Date(tripDto.endTime),
    };
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
    return this.tripsService.update(id, updateData);
  }
}
