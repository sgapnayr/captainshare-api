import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(): User[] {
    return this.usersService.list(); // Ensure your service has a `list` method to retrieve all users
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    try {
      return this.usersService.findOne(id);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<User>): User {
    try {
      return this.usersService.update(id, updateData);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  create(@Body() user: Partial<User>): User {
    try {
      return this.usersService.create(user);
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string): { message: string } {
    try {
      this.usersService.delete(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error.message.includes('User not found')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
