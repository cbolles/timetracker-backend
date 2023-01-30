import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, AuthResolver],
  imports: [UserModule],
})
export class AuthModule {}
