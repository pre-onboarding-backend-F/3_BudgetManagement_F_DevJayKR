import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('access-token') {
	handleRequest(err: any, user: any, info: any, context: ExecutionContext, status: number) {
		if (info instanceof JsonWebTokenError) {
			throw new UnauthorizedException('유효하지 않은 토큰입니다.');
		}

		return super.handleRequest(err, user, info, context, status);
	}
}
