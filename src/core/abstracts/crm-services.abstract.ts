import { User } from '../entities/user.entity';

export abstract class ICrmServices {
  abstract userAdded(user: User): Promise<boolean>;
}
