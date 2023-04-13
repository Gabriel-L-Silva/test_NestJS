import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  CreateUserResponseDto,
} from '../core/dtos';
import { UserUseCases, UserFactoryService } from '../use-cases/user';

@Controller('api/user')
export class UserController {
  constructor(
    private userUseCases: UserUseCases,
    private userFactoryService: UserFactoryService,
  ) {}

  @Get()
  async getAll() {
    return this.userUseCases.getAllUsers();
  }

  @Get(':id')
  async getById(@Param('id') id: any) {
    return this.userUseCases.getUserById(id);
  }

  @Post()
  async createUser(
    @Body() userDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const createUserResponse = new CreateUserResponseDto();
    try {
      const user = this.userFactoryService.createNewUser(userDto);
      const createdUser = await this.userUseCases.createUser(user);

      createUserResponse.success = true;
      createUserResponse.createdUser = createdUser;
    } catch (error) {
      // report and log error
      createUserResponse.success = false;
    }

    return createUserResponse;
  }

  @Put(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.userFactoryService.updateUser(updateUserDto);
    return this.userUseCases.updateUser(userId, user);
  }
}
