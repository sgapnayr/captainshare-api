import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { BoatsService } from './boats.service';
import { Boat } from './entities/boat.entity';

@Controller('boats')
export class BoatsController {
  constructor(private readonly boatsService: BoatsService) {}

  @Post()
  create(@Body() boat: Partial<Boat>): Boat {
    return this.boatsService.create(boat);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Boat | undefined {
    return this.boatsService.findOne(id);
  }

  @Get()
  list(): Boat[] {
    return this.boatsService.list();
  }

  @Delete(':id')
  delete(@Param('id') id: string): boolean {
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
}
