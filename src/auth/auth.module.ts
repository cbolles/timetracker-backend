import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Credentials, CredentialsSchema } from './auth.model';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';

@Module({
  providers: [AuthService, AuthResolver, JwtStrategy, JwtAuthGuard],
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('jwtSecret'),
        signOptions: { expiresIn: '4h' }
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([{ name: Credentials.name, schema: CredentialsSchema }])
  ],
})
export class AuthModule {}
