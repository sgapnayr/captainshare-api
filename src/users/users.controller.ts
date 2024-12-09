// src/users/users.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: Partial<User>): User {
    return this.usersService.create(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string): User | undefined {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): User | undefined {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): boolean {
    return this.usersService.delete(id);
  }
}
