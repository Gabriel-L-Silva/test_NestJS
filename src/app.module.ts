import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user/schemas/user.schema';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import config from './config/services';
import { RMQService } from './rabbitmq/rmq.service';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, RMQService, EmailService],
})
export class AppModule {}
