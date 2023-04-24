import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.schema';
import { RMQService } from '../rabbitmq/rmq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './user.module';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ isGlobal: true }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGO_URI'),
          }),
          inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            transport: {
              host: 'smtp.gmail.com',
              auth: {
                user: configService.get<string>('EMAIL_USER'),
                pass: configService.get<string>('EMAIL_PASSWORD'),
              },
            },
          }),
          inject: [ConfigService],
        }),
        UserModule,
      ],
      controllers: [UserController],
      providers: [UserService, RMQService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '',
        hash: '',
      };

      jest.spyOn(userService, 'update').mockImplementation(async () => user);

      expect(await userController.update(user, userId)).toBe(user);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete user avatar successfully', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '',
        hash: null,
      };

      jest
        .spyOn(userService, 'deleteAvatar')
        .mockImplementation(async () => user);

      expect(await userController.deleteAvatar(userId)).toBe(user);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '',
        hash: '',
      };

      jest.spyOn(userService, 'delete').mockImplementation(async () => user);

      expect(await userController.delete(userId)).toBe(user);
    });
  });

  describe('findOne', () => {
    it('should find user successfully', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '',
        hash: '',
      };

      jest.spyOn(userService, 'findOne').mockImplementation(async () => user);

      expect(await userController.findOne(userId)).toBe(user);
    });
  });

  describe('findAll', () => {
    it('should find all users successfully', async () => {
      const users = [
        {
          id: 1,
          email: 'test1@test.com',
          first_name: 'John',
          last_name: 'Doe',
          avatar: '',
          image_path: '',
          hash: '',
        },
        {
          id: 2,
          email: 'test2@test.com',
          first_name: 'Jane',
          last_name: 'Doe',
          avatar: '',
          image_path: '',
          hash: '',
        },
      ];

      jest.spyOn(userService, 'findAll').mockImplementation(async () => users);

      expect(await userController.findAll()).toBe(users);
    });
  });
});
