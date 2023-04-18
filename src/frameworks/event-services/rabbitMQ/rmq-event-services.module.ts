import { Module } from '@nestjs/common';
import { RMQEventServices } from './rmq-event-services.service';
import { RMQ_CONFIGURATION } from '../../../configuration';


@Module({
  providers: [RMQService],
  exports: [RMQService],
})
export class RMQEventServicesModule {}
