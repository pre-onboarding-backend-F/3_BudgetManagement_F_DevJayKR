import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ConfigModuleOptions } from './global/configs/config-module-options';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';

@Module({
	imports: [ConfigModule.forRoot(ConfigModuleOptions), DatabaseModule, AuthModule, UsersModule],
})
export class AppModule {}
