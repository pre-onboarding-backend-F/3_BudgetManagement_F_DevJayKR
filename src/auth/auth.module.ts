import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { AtStrategy } from './strategies/access-token-strategy';
import { RtStrategy } from './strategies/refresh-token-strategy';

@Module({
	imports: [UsersModule, JwtModule.register({})],
	providers: [AuthService, LocalStrategy, AtStrategy, RtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
