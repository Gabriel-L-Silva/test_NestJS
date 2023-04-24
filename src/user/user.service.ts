import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import axios, { AxiosResponse } from 'axios';
import { createHash } from 'crypto';
import { RMQService } from '../rabbitmq/rmq.service';
import config from '../config/services';
import { Cache } from 'cache-manager';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(RMQService) private readonly rmqService: RMQService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly mailerService: MailerService,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    try {
      this.mailerService.sendMail({
        to: user.email,
        from: config.email,
        subject: 'Welcome to our app!',
        text: `Hello ${user.first_name},\n\nWelcome to our app!`,
      });
    } catch (error) {
      console.log(
        `Error sending email to user ${user.first_name} ${user.last_name} with email ${user.email}`,
      );
    }

    this.rmqService.publish(
      config.rabbitMqUsersExchange,
      `User created as: ${createdUser}`,
      config.rabbitMqUsersQueue,
    );

    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id: id });
    if (!user) {
      try {
        const response: AxiosResponse<{ data: User }> = await axios.get(
          `https://reqres.in/api/users/${id}`,
        );
        return await this.create(response.data.data);
      } catch (error) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
    return user;
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.findOneAndRemove({ id: id });
  }

  async getAvatar(id: string): Promise<string> {
    const cachedData = await this.cacheService.get<{ image: string }>(id);
    if (cachedData) {
      return cachedData.image;
    }

    const user = await this.findOne(id);
    const response = await axios.get(user.avatar, {
      responseType: 'arraybuffer',
    });

    user.hash = createHash('sha256').update(response.data).digest('hex');
    this.update(id, user);
    this.cacheService.set(
      id,
      { image: response.data.toString('base64') },
      config.cacheTTL,
    );
    return response.data.toString('base64');
  }

  async deleteAvatar(id: string): Promise<User> {
    const user = await this.findOne(id);
    this.cacheService.del(id);
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
      hash: null,
    };
  }

  async update(id: string, user: User): Promise<User> {
    return await this.userModel.findOneAndUpdate({ id: id }, user, {
      new: true,
    });
  }
}
