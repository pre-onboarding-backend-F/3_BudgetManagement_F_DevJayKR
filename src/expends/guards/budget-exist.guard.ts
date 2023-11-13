import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/auth/users/user.entity';
import { Budget } from 'src/budgets/budget.entity';
import { BudgetsService } from 'src/budgets/budgets.service';
import { Categories } from 'src/categories/enum/category.enum';

interface RequestInterface extends Request {
	user: User;
	budget: Budget;
}

@Injectable()
export class BudgetExistGuard implements CanActivate {
	constructor(private readonly budgetsService: BudgetsService) {}

	async canActivate(context: ExecutionContext) {
		const req: RequestInterface = context.switchToHttp().getRequest();
		const user = req.user;
		const { category } = req.body;

		const budget = await this.findOneBudget(user, category);

		if (!budget) {
			throw new BadRequestException('존재하지않는 예산입니다.');
		}

		req.budget = budget;
		return true;
	}

	async findOneBudget(user: User, category: Categories) {
		return await this.budgetsService.findOne({
			category: {
				name: category,
			},
			user: {
				id: user.id,
			},
		});
	}
}
