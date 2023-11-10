import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Reflector } from '@nestjs/core';

export interface Info {
	success: true;
	//message: string;
}

export type Response<T> = Info & {
	data: T;
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Text, Response<T>> {
	constructor(private reflector: Reflector) {}

	intercept(ctx: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => ({
				success: true,
				data,
			})),
		);
	}
}
