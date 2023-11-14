import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ConfigModuleOptions } from './global/configs/config-module-options';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './global/filters/http-exception.filter';
import { ValidationExceptionFilter } from './global/filters/validation-exception.filter';
import { CategoriesModule } from './categories/categories.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ExpendsModule } from './expends/expends.module';
import { TransformInterceptor } from './global/interceptors/transform.interceptor';
import { validationExceptionFactory } from './global/factories/validation-exception.factory';

@Module({
	imports: [
		ConfigModule.forRoot(ConfigModuleOptions),
		DatabaseModule,
		AuthModule,
		UsersModule,
		CategoriesModule,
		BudgetsModule,
		ExpendsModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: ValidationExceptionFilter,
		},
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				transform: true,
				whitelist: true,
				exceptionFactory: validationExceptionFactory,
			}),
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}
