import { Injectable } from '@nestjs/common';
import { User } from '../../core/entities';
import { IDataServices, ICrmServices } from '../../core/abstracts';

@Injectable()
export class UserUseCases {
  constructor(
    private dataServices: IDataServices,
    private crmServices: ICrmServices,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.dataServices.users.getAll();
  }

  getUserById(id: any): Promise<User> {
    return this.dataServices.users.getOne(id);
  }

  async createUser(user: User): Promise<User> {
    try {
      // call to our dependencies
      const createdUser = await this.dataServices.users.create(user);
      await this.crmServices.userAdded(createdUser);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  updateUser(userId: string, user: User): Promise<User> {
    return this.dataServices.users.update(userId, user);
  }
}
