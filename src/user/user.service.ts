/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({ id: id });
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.findOneAndRemove({ id: id });
  }

  async deleteAvatar(id: string): Promise<User> {
    const user = await this.findOne(id);
    fs.unlinkSync(user.image_path);
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
      image_path: null,
      hash: null,
    };
  }

  async update(id: string, user: User): Promise<User> {
    return await this.userModel.findOneAndUpdate({ id: id }, user, {
      new: true,
    });
  }
}
