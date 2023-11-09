import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule, UsersModule } from './auth';
import { ConfigModuleOptions } from './global';

@Module({
	imports: [ConfigModule.forRoot(ConfigModuleOptions), DatabaseModule, AuthModule, UsersModule],
})
export class AppModule {}
