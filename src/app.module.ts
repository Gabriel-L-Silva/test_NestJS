import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { DataServicesModule } from './services/data-services/data-services.module';
import { UserUseCasesModule } from './use-cases/user/user-use-cases.module';
import { CrmServicesModule } from './services/crm-services/crm-services.module';

@Module({
  imports: [DataServicesModule, UserUseCasesModule, CrmServicesModule],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
