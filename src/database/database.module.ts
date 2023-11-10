import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfiguration from 'src/global/configs/database-configuration';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [databaseConfiguration.KEY],
			useFactory: (config: ConfigType<typeof databaseConfiguration>) => ({
				type: 'postgres',
				host: config.host,
				port: config.port,
				username: config.username,
				password: config.password,
				database: config.database,
				synchronize: config.synchorize,
				entities: [__dirname + '/../**/*.entity.*'],
				logging: config.logging,
				charset: 'utf8mb4',
			}),
		}),
	],
})
export class DatabaseModule {}
