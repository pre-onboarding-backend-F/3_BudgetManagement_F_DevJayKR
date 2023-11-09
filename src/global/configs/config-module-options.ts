import { ConfigModuleOptions as Options } from '@nestjs/config';
import { validationSchema } from './validation-schema';
import jwtConfiguration from './jwt-configuration';
import databaseConfiguration from './database-configuration';
import { cwd } from 'process';

export const ConfigModuleOptions: Options = {
	isGlobal: true,
	envFilePath: cwd() + `/src/global/configs/envs/${process.env.NODE_ENV}.env`,
	load: [jwtConfiguration, databaseConfiguration],
	validationSchema,
};
