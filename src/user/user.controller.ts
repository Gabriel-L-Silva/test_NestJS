import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import axios, { AxiosResponse } from 'axios';
import { createHash } from 'crypto';
import { RMQService } from '../rabbitmq/rmq.service';
import { EmailService } from '../email/email.service';

@Controller('api/users')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(RMQService) private readonly rmqService: RMQService,
    @Inject(EmailService) private readonly emailService: EmailService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      try {
        const response: AxiosResponse<{ data: User }> = await axios.get(
          `https://reqres.in/api/users/${id}`,
        );
        return await this.userService.create(response.data.data);
      } catch (error) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } else {
      return user;
    }
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id): Promise<string> {
    const user = await this.userService.findOne(id);
    const image = user.image_path;
    if (!image) {
      const response = await axios.get(user.avatar, {
        responseType: 'arraybuffer',
      });

      const fileExtension = response.headers['content-type'].split('/')[1];
      const filename = `${id}-avatar.${fileExtension}`;
      const filePath = path.join(__dirname, '../..', 'avatars', filename);
      fs.writeFileSync(filePath, response.data);

      user.image_path = filePath;
      user.hash = createHash('sha256').update(response.data).digest('hex');
      this.userService.update(id, user);

      return response.data.toString('base64');
    }
    return fs.readFileSync(image).toString('base64');
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    const createdUser = await this.userService.create(user);

    // Send email to the user
    const to = user.email;
    const subject = 'Welcome to our app!';
    const text = `Hello ${user.first_name},\n\nWelcome to our app!`;
    this.emailService.sendEmail(to, subject, text);

    this.rmqService.publish('', createdUser);

    return createdUser;
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
  async update(@Body() user: User, @Param('id') id): Promise<User> {
    return this.userService.update(id, user);
  }
}
