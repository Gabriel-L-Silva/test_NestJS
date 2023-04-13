import { Module } from '@nestjs/common';
import { ICrmServices } from '../../../core';

import { CreationService } from './creation-service.service';

@Module({
  providers: [
    {
      provide: ICrmServices,
      useClass: CreationService,
    },
  ],
  exports: [ICrmServices],
})
export class CreationServicesModule {}
