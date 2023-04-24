import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { CreateUserDto } from './user.dto';

@Controller('api/users')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id): Promise<string> {
    return await this.userService.getAvatar(id);
  }

  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<User> {
    return await this.userService.create(userDto);
  }

  @Delete(':id')
  async delete(@Param('id') id): Promise<User> {
    return this.userService.delete(id);
  }

  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id): Promise<User> {
    return this.userService.deleteAvatar(id);
  }

  @Put(':id')
  async update(@Body() userDto: CreateUserDto, @Param('id') id): Promise<User> {
    return this.userService.update(id, userDto);
  }
}
