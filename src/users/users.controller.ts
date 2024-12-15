import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AvailabilityDto } from './dto/availability.dto';
import { FilterUsersDto } from './dto/filter-user.dto';
import { PreferredCaptainsDto } from './dto/preferred-captains.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string): void {
    this.usersService.delete(id);
  }

  @Get()
  list(@Query() filterUsersDto: FilterUsersDto): User[] {
    const { page = 1, limit = 10, ...filters } = filterUsersDto;
    return this.usersService.listWithPagination(filters, page, limit);
  }

  @Post(':id/availability')
  addAvailability(
    @Param('id') id: string,
    @Body() availabilityDto: AvailabilityDto,
  ): User {
    return this.usersService.addAvailability(id, availabilityDto);
  }

  @Patch(':id/roles/add')
  addRole(
    @Param('id') id: string,
    @Body('role') role: 'CAPTAIN' | 'OWNER' | 'ADMIN',
  ): User {
    if (!['CAPTAIN', 'OWNER', 'ADMIN'].includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    return this.usersService.addRole(id, role);
  }

  @Patch(':id/roles/remove')
  removeRole(
    @Param('id') id: string,
    @Body('role') role: 'CAPTAIN' | 'OWNER' | 'ADMIN',
  ): User {
    if (!['CAPTAIN', 'OWNER', 'ADMIN'].includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }
    return this.usersService.removeRole(id, role);
  }

  @Patch(':id/certifications')
  updateCertifications(
    @Param('id') id: string,
    @Body('certifications') certifications: string[],
  ): User {
    return this.usersService.update(id, { certifications });
  }

  @Patch(':id/preferred-boat-types')
  updatePreferredBoatTypes(
    @Param('id') id: string,
    @Body('preferredBoatTypes') preferredBoatTypes: string[],
  ): User {
    return this.usersService.update(id, { preferredBoatTypes });
  }

  @Patch(':id/rate-per-hour')
  updateRatePerHour(
    @Param('id') id: string,
    @Body('ratePerHour') ratePerHour: number,
  ): User {
    if (ratePerHour < 0) {
      throw new BadRequestException('Rate per hour must be a positive number.');
    }
    return this.usersService.update(id, { ratePerHour });
  }

  @Patch(':id/preferred-captains')
  updatePreferredCaptains(
    @Param('id') id: string,
    @Body() preferredCaptainsDto: PreferredCaptainsDto,
  ): User {
    return this.usersService.updatePreferredCaptains(
      id,
      preferredCaptainsDto.captains,
    );
  }

  @Post('captains/available')
  queryCaptainsByAvailability(
    @Body() availabilityDto: AvailabilityDto,
  ): User[] {
    return this.usersService.queryCaptainsByAvailability(
      availabilityDto,
      availabilityDto.certifications,
      availabilityDto.rateRange,
    );
  }
}
