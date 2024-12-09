import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './user.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') }
      }),
      global: true,
      inject: [ConfigService]
    }),
  ],
  exports: [AuthMiddleware,UsersService],
  providers: [AuthService,UsersService,AuthMiddleware]
})
export class AuthModule {}
