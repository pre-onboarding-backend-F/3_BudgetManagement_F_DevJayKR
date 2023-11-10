import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './global/interceptors/transform.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const PORT = app.get(ConfigService).getOrThrow('SERVER_PORT');
	const reflector = app.get(Reflector);

	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
	app.useGlobalInterceptors(new TransformInterceptor(reflector), new ClassSerializerInterceptor(reflector));

	await app.listen(PORT);
}
bootstrap();
