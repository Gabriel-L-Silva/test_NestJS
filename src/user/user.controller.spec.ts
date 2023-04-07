import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RMQService } from '../rabbitmq/rmq.service';
import { EmailService } from '../email/email.service';
import config from '../config/services'
import { after } from 'node:test';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let rmqService: RMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(config.mongoURI),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      controllers: [UserController],
      providers: [UserService, RMQService, EmailService],
    }).compile();
    
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    rmqService = module.get<RMQService>(RMQService);
  });

  afterAll(() => {
    rmqService.disconnect();
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
        image_path: '',
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
        image_path: '',
        hash: '',
      };

      jest.spyOn(userService, 'deleteAvatar').mockImplementation(async () => user);

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
        image_path: '',
        hash: '',
      };

      jest.spyOn(userService, 'delete').mockImplementation(async () => user);

      expect(await userController.delete(userId)).toBe(user);
    });
  });

  describe('findOne', () => {
    it('should find user successfully', async () => {
      const userId = 1;
      const user: User ={
        id: userId,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '',
        image_path: '',
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

  describe('create', () => {
    it('should create user successfully', async () => {
      const user: User = {
        id: 1,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '',
        image_path: '',
        hash: '',
      };

      jest.spyOn(userService, 'create').mockImplementation(async () => user);

      expect(await userController.create(user)).toBe(user);
    });
  });
});
