import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../core/dtos/user.dto';

@Injectable()
export class UserFactoryService {
  createNewUser(createUserDto: CreateUserDto) {
    const newUser = new User();
    newUser.id = createUserDto.id;
    newUser.email = createUserDto.email;
    newUser.first_name = createUserDto.first_name;
    newUser.last_name = createUserDto.last_name;
    newUser.avatar = createUserDto.avatar;
    newUser.image_path = createUserDto.image_path;
    newUser.hash = createUserDto.hash;

    return newUser;
  }

  updateUser(updateUserDto: UpdateUserDto) {
    const newUser = new User();
    newUser.id = updateUserDto.id;
    newUser.email = updateUserDto.email;
    newUser.first_name = updateUserDto.first_name;
    newUser.last_name = updateUserDto.last_name;
    newUser.avatar = updateUserDto.avatar;
    newUser.image_path = updateUserDto.image_path;
    newUser.hash = updateUserDto.hash;

    return newUser;
  }
}
