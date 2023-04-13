import { Module } from '@nestjs/common';
import { CreationServicesModule } from '../../frameworks/crm-services/creation/creation-service.module';

@Module({
  imports: [CreationServicesModule],
  exports: [CreationServicesModule],
})
export class CrmServicesModule {}
