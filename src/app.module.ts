import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from './global/configs/config-module-options';
import { DatabaseModule } from './database/database.module';

@Module({
	imports: [ConfigModule.forRoot(ConfigModuleOptions), DatabaseModule],
})
export class AppModule {}
