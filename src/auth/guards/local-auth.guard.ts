import { BadRequestException, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
	handleRequest<TUser>(err: any, user: any, info: any, context: ExecutionContext): TUser {
		const request: Request = context.switchToHttp().getRequest();
		const response: Response = context.switchToHttp().getResponse();

		const body = plainToClass(LoginDto, request.body);
		const errors = validateSync(body);

		const errorMessages = errors.flatMap(({ constraints }) => Object.values(constraints));

		if (errorMessages.length > 0) {
			response.status(HttpStatus.BAD_REQUEST).send({
				message: errorMessages,
				error: 'Bad Request',
				statusCode: HttpStatus.BAD_REQUEST,
			});
		}

		if (err) {
			if (err.status == 404) throw new BadRequestException('존재하지않는 유저네임입니다.');
			if (err.status == 400) throw new BadRequestException('패스워드가 틀렸습니다.');
		}

		return user;
	}
}
