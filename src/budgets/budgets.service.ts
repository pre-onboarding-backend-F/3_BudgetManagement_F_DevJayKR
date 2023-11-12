import { BadRequestException, Injectable } from '@nestjs/common';
import { BudgetsRepository } from './budgets.repository';
import { CategoriesService } from 'src/categories/categories.service';
import { Budget } from './budget.entity';
import { Categories } from 'src/categories/enum/category.enum';
import { User } from 'src/auth/users/user.entity';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
	constructor(
		private readonly budgetsRepository: BudgetsRepository,
		private readonly categoriesService: CategoriesService,
	) {}

	private async findOneCategory(name: Categories) {
		return await this.categoriesService.findOne({ name });
	}

	async create(dto: CreateBudgetDto, user: User) {
		const { startedAt, endedAt } = this.setDates(dto.startedAt);
		const category = await this.findOneCategory(dto.category);

		const existBudget = await this.budgetsRepository.findOne({
			user: { id: user.id },
			category: {
				id: category.id,
			},
		});

		if (existBudget) {
			const isEnded = Date.now() > existBudget.endedAt.getTime();

			if (!isEnded) {
				throw new BadRequestException(
					'이미 존재하는 예산입니다. 예산 기간이 종료되기 전엔 생성이 불가능합니다. 예산을 변경하시려면 수정 기능을 사용하세요.',
				);
			}
		}

		const newBudget = new Budget({
			budget: dto.budget,
			category,
			startedAt,
			endedAt,
			user,
		});

		const { id } = await this.budgetsRepository.create(newBudget);

		return await this.findOne({
			id,
		});
	}

	async find(user: User) {
		return this.budgetsRepository.find({
			select: {
				category: {
					name: true,
				},
			},
			relations: {
				category: true,
			},
			where: {
				user: {
					id: user.id,
				},
			},
		});
	}

	async findOne(where: FindOptionsWhere<Budget>, relations?: FindOptionsRelations<Budget>) {
		return await this.budgetsRepository.findOne(where, relations);
	}

	async update(dto: UpdateBudgetDto, user: User, budgetId: string) {
		const { startedAt, endedAt } = this.setDates(dto.startedAt);

		const budget = await this.budgetsRepository.exist({ id: budgetId });
		if (!budget) throw new BadRequestException('존재하지않는 예산 ID입니다.');

		return await this.budgetsRepository.findOneAndUpdate(
			{ id: budgetId, user: { id: user.id } },
			{ budget: dto.budget, startedAt, endedAt: endedAt },
		);
	}

	async delete(user: User, budgetId: string) {
		const budget = await this.findOne({ id: budgetId }, { user: true });
		const isUserOwnedBudget = budget?.user.id == user.id;

		if (!isUserOwnedBudget) {
			throw new BadRequestException('존재하지않는 예산 ID입니다.');
		}

		await this.budgetsRepository.findOneAndDelete({
			id: budgetId,
			user: {
				id: user.id,
			},
		});
	}

	private setDates(start: string) {
		const startedAt = new Date(start);
		const endedAt = new Date(startedAt);

		endedAt.setMonth(startedAt.getMonth() + 1);

		return { startedAt, endedAt };
	}
}
