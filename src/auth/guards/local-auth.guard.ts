import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
	handleRequest(err: any, user: any, info: any, context: ExecutionContext, status: number) {
		if (err) {
			throw err;
		}

		if (info) {
			throw new BadRequestException('로그인 정보가 누락되었습니다 다시 확인해주세요.');
		}

		return super.handleRequest(err, user, info, context, status);
	}
}
