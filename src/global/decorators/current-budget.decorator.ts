import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentBudget = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest();
	return req.budget;
});
