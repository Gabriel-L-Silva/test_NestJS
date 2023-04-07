import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { User } from 'src/user/schemas/user.schema';
import config from '../config/services';

@Injectable()
export class RMQService {
  private conn: Connection;
  private channel: Channel;

  async connect() {
    const url = config.RABBIT_MQ_URI;
    this.conn = await connect(url);
    this.channel = await this.conn.createChannel();

    await this.channel.assertExchange(config.RMQ_EXCHANGE, 'fanout', {
      durable: false,
    });

    const q = await this.channel.assertQueue('', { exclusive: true });

    // Bind the user_created queue to the exchange with the "user_created" routing key
    await this.channel.bindQueue(q.queue, 'messages', '');

    console.log('Connected to RabbitMQ');
  }

  async publishUserCreatedEvent(user: User) {
    const message = JSON.stringify(user);

    const posted = await this.channel.publish(
      config.RMQ_EXCHANGE,
      config.RABBIT_MQ_USERS_QUEUE,
      Buffer.from(message),
    );
    console.log(`${message}\n sent: ${posted}`);
  }

  async disconnect() {
    await this.channel.close();
    await this.conn.close();
  }
}
