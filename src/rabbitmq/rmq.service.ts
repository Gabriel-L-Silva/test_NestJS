import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import config from '../config/services';

@Injectable()
export class RMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  async onModuleInit() {
    console.log('RMQService has been initialized!');
    this.connection = await connect(config.RABBIT_MQ_URI);
    this.channel = await this.connection.createChannel();
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
    console.log('RMQService has been destroyed!');
  }

  async publish(queue: string, message: any) {
    await this.channel.assertQueue(queue);
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async getConnection(): Promise<Connection> {
    return this.connection;
  }

  async getChannel(): Promise<Channel> {
    return this.channel;
  }
}
