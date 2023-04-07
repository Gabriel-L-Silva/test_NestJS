import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RMQService } from './rabbitmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rmqService = app.get(RMQService);
  await rmqService.connect();

  await app.listen(3000);
}
bootstrap();
