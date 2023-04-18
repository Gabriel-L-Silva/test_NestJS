import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { RMQ_CONFIGURATION } from '../../../configuration';

@Injectable()
export class RMQEventServices implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  async onModuleInit() {
    this.connection = await connect(RMQ_CONFIGURATION.connectionString);
    this.channel = await this.connection.createChannel();
    this.channel.assertExchange(RMQ_CONFIGURATION.exchange, 'fanout', {
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
