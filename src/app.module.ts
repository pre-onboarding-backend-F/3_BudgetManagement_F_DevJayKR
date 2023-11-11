import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ConfigModuleOptions } from './global/configs/config-module-options';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './global/filters/http-exception.filter';
import { ValidationExceptionFilter } from './global/filters/validation-exception.filter';
import { CategoriesModule } from './categories/categories.module';

@Module({
	imports: [ConfigModule.forRoot(ConfigModuleOptions), DatabaseModule, AuthModule, UsersModule, CategoriesModule],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: ValidationExceptionFilter,
		},
	],
})
export class AppModule {}
