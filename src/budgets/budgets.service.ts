import { BadRequestException, Injectable } from '@nestjs/common';
import { BudgetsRepository } from './budgets.repository';
import { CategoriesService } from 'src/categories/categories.service';
import { Budget } from './budget.entity';
import { Categories } from 'src/categories/enum/category.enum';
import { User } from 'src/auth/users/user.entity';
import {
	FindOptionsRelations,
	FindOptionsWhere,
	EntityManager,
	LessThanOrEqual,
	MoreThan,
	Not,
	LessThan,
} from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { RecommendBudgetDto } from './dto/recommend-budget.dto';

@Injectable()
export class BudgetsService {
	constructor(
		private readonly budgetsRepository: BudgetsRepository,
		private readonly categoriesService: CategoriesService,
		private readonly entityManager: EntityManager,
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
				endedAt: MoreThan(new Date()) && Not(LessThan(new Date())),
			},
		});
	}

	async setRecommend(user: User, dto: RecommendBudgetDto) {
		const recommends = await this.recommendCategory();

		// TODO: 여기 개발해야함,
		// recommends :>>  [ { category_name: '문화', use_count: '1', average_budget: '23000' } ]
		// average budget을 퍼센트로 변환해서 dto로 들어온 budget으로 해당 퍼센테이지만큼 할당

		console.log('recommends :>> ', recommends);
	}

	async recommendCategory() {
		const qb = await this.entityManager
			.createQueryBuilder(Budget, 'b')
			.select('c.name', 'category_name')
			.addSelect('COUNT(c.name)', 'use_count')
			.addSelect('AVG(b.budget)::numeric(10, 0)', 'average_budget')
			.leftJoin('b.category', 'c')
			.groupBy('c.name')
			.addGroupBy('c.id')
			.orderBy('"use_count"', 'DESC')
			.limit(3)
			.getRawMany();

		return qb;
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
