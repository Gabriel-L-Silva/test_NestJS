import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import config from '../config/services';

@Injectable()
export class RMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  async onModuleInit() {
    this.connection = await connect(config.rabbitMqUri);
    this.channel = await this.connection.createChannel();
    this.channel.assertExchange(config.rabbitMqUsersExchange, 'fanout', {
      durable: false,
    });
    console.log('Connected to RabbitMQ');
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
    console.log('RMQService has been destroyed!');
  }

  async publish(exchange: string, message: any, queue = '') {
    await this.channel.publish(
      exchange,
      queue,
      Buffer.from(JSON.stringify(message)),
    );
  }

  async getConnection(): Promise<Connection> {
    return this.connection;
  }

  async getChannel(): Promise<Channel> {
    return this.channel;
  }
}
