import { Module } from '@nestjs/common';
import { DataServicesModule } from '../../services/data-services/data-services.module';
import { CrmServicesModule } from '../../services/crm-services/crm-services.module';
import { UserFactoryService } from './user-factory.service';
import { UserUseCases } from './user.use-case';

@Module({
  imports: [DataServicesModule, CrmServicesModule],
  providers: [UserFactoryService, UserUseCases],
  exports: [UserFactoryService, UserUseCases],
})
export class UserUseCasesModule {}