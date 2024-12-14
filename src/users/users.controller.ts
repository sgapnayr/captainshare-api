import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AvailabilityDto } from './dto/availability.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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
  delete(@Param('id') id: string): { message: string } {
    this.usersService.delete(id);
    return { message: 'User soft-deleted successfully' };
  }

  @Get()
  list(
    @Query('role') role?: 'CAPTAIN' | 'OWNER',
    @Query('isDeleted') isDeleted: string = 'false',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): User[] {
    const filters: Partial<User> = {};
    if (role) filters.roles = [role];
    filters.isDeleted = isDeleted === 'true';

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
    @Body('role') role: 'CAPTAIN' | 'OWNER',
  ): User {
    return this.usersService.addRole(id, role);
  }

  @Patch(':id/roles/remove')
  removeRole(
    @Param('id') id: string,
    @Body('role') role: 'CAPTAIN' | 'OWNER',
  ): User {
    return this.usersService.removeRole(id, role);
  }
}
