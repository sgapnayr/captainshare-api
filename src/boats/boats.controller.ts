import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Patch,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { BoatsService } from './boats.service';
import { Boat } from './entities/boat.entity';
import { CreateBoatDto } from './dto/create-boat.dto';

@Controller('boats')
export class BoatsController {
  constructor(private readonly boatsService: BoatsService) {}

  @Post()
  create(@Body() boatDto: CreateBoatDto): Boat {
    const { userRole, userId } = boatDto;

    if (!['OWNER', 'ADMIN'].includes(userRole)) {
      throw new ForbiddenException('Only owners or admins can create boats.');
    }

    return this.boatsService.create(userId, boatDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Boat {
    const boat = this.boatsService.findOne(id);
    if (!boat) {
      throw new BadRequestException(`Boat with ID ${id} not found.`);
    }
    return boat;
  }

  @Get()
  list(): Boat[] {
    return this.boatsService.list();
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Body('userId') userId: string): boolean {
    const boat = this.boatsService.findOne(id);
    if (!boat) {
      throw new BadRequestException(`Boat with ID ${id} not found.`);
    }

    if (!boat.ownerIds.includes(userId) && !this.isAdmin(userId)) {
      throw new ForbiddenException(
        'Only the owner or an admin can delete a boat.',
      );
    }

    return this.boatsService.delete(id);
  }

  @Post('filter')
  filterByCaptain(
    @Body() filterDto: { certifications: string[]; licenses: string[] },
  ): Boat[] {
    return this.boatsService.filterByCaptain(
      filterDto.certifications,
      filterDto.licenses,
    );
  }

  @Patch(':id/preferred-captains')
  updatePreferredCaptains(
    @Param('id') id: string,
    @Body() body: { captains: string[]; userId: string },
  ): Boat {
    const { captains, userId } = body;

    const boat = this.boatsService.findOne(id);
    if (!boat) {
      throw new BadRequestException(`Boat with ID ${id} not found.`);
    }

    if (!boat.ownerIds.includes(userId)) {
      throw new ForbiddenException(
        'Only the owner of the boat can update preferred captains.',
      );
    }

    return this.boatsService.updatePreferredCaptains(id, captains);
  }

  private isAdmin(userId: string): boolean {
    if (userId === 'admin') {
      return true;
    }
    return false;
  }
}
