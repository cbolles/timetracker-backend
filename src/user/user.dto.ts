import { User } from './user.model';

export interface UserCreate extends Omit<User, '_id'> {}
