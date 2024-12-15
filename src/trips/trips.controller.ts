import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AssignCaptainDto } from './dto/assign-captain.dto';
import { CounterOfferDto } from './dto/counter-offer.dto';
import { UpdateTripStatusDto } from './dto/update-trip-status.dto';
import { Trip } from './entities/trip.entity';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    try {
      return await this.tripsService.create(createTripDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error occurred while creating the trip.',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Trip> {
    try {
      return await this.tripsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Trip not found.');
      }
      throw new InternalServerErrorException(
        'Error occurred while retrieving the trip.',
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.tripsService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Trip with ID ${id} not found.`);
      }
      throw new InternalServerErrorException(
        'Error occurred while deleting the trip.',
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
  ): Promise<Trip> {
    try {
      return await this.tripsService.update(id, updateTripDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Trip with ID ${id} not found.`);
      }
      throw new InternalServerErrorException(
        'Error occurred while updating the trip.',
      );
    }
  }

  @Patch(':id/assign-captain')
  async assignCaptain(
    @Param('id') id: string,
    @Body() assignCaptainDto: AssignCaptainDto,
  ): Promise<Trip> {
    try {
      return await this.tripsService.assignCaptain(id, assignCaptainDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Trip or Captain not found.');
      }
      throw new InternalServerErrorException(
        'Error occurred while assigning the captain.',
      );
    }
  }

  @Patch(':id/counteroffer')
  async handleCounterOffer(
    @Param('id') id: string,
    @Body() counterOfferDto: CounterOfferDto,
  ): Promise<Trip> {
    try {
      return await this.tripsService.handleCounterOffer(
        id,
        counterOfferDto.counterRate,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Trip with ID ${id} not found.`);
      }
      throw new InternalServerErrorException(
        'Error occurred while handling the counteroffer.',
      );
    }
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTripStatusDto: UpdateTripStatusDto,
  ): Promise<Trip> {
    try {
      return await this.tripsService.updateStatus(id, updateTripStatusDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Trip with ID ${id} not found.`);
      }
      throw new InternalServerErrorException(
        'Error occurred while updating the trip status.',
      );
    }
  }
}
