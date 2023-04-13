import { User } from '../entities/user.entity';

export class CreateUserResponseDto {
  success: boolean;

  createdUser: User;
}
