import { registerAs } from '@nestjs/config';

export default registerAs('databaseConfiguration', () => ({
	username: process.env.POSTGRESQL_USERNAME,
	password: process.env.POSTGRESQL_PASSWORD,
	host: process.env.POSTGRESQL_HOST,
	port: +process.env.POSTGRESQL_PORT,
	database: process.env.POSTGRESQL_DATABASE,
	synchorize: JSON.parse(process.env.POSTGRESQL_SYNCHRONIZE),
	logging: JSON.parse(process.env.POSTGRESQL_LOGGING),
}));
