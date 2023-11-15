import { FindExpendsQueryDto } from './dto/find-expends.dto';
import { User } from 'src/auth/users/user.entity';
import { ExpendsRepository } from './expends.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExpendDto } from './dto/create-expend.dto';
import { Expend } from './expend.entity';
import { EntityManager } from 'typeorm';
import { UpdateExpendDto } from './dto/update-expend.dto';
import { Categories } from 'src/categories/enum/category.enum';
import { BudgetsService } from 'src/budgets/budgets.service';
import { Budget } from 'src/budgets/budget.entity';

@Injectable()
export class ExpendsService {
	constructor(
		private readonly expendsRepository: ExpendsRepository,
		private readonly budgetsService: BudgetsService,
		private readonly entityManager: EntityManager,
	) {}

	async create(user: User, dto: CreateExpendDto) {
		const budget = await this.findBudget(user, dto.category);

		const newExpend = new Expend({
			expense: dto.expense,
			memo: dto.memo,
			expendedAt: new Date(dto.expendedAt),
			except: dto.except,
			budget,
			user,
		});

		return await this.expendsRepository.create(newExpend);
	}

	async todayExpenseRecommend(user: User) {
		const qb = this.entityManager.createQueryBuilder(Budget, 'budget');
		qb.select('budget.category');
		qb.addSelect('budget.budget as total_budget');
		qb.addSelect('COUNT(CASE WHEN expends.except = false THEN 1 END)::integer as expended_count');
		qb.addSelect('COUNT(CASE WHEN expends.except = true THEN 1 END)::integer as excepted_count');
		qb.addSelect('EXTRACT(DAY FROM budget.ended_at - NOW())::integer AS due_days');
		qb.addSelect(
			'CASE WHEN ROUND((budget - COALESCE(SUM(CASE WHEN expends.except = false THEN expends.expense ELSE 0 END), 0)) / EXTRACT(DAY FROM budget.ended_at - NOW()), -2)::integer <= 0 THEN 1000::integer ELSE ROUND((budget - COALESCE(SUM(CASE WHEN expends.except = false THEN expends.expense ELSE 0 END), 0)) / EXTRACT(DAY FROM budget.ended_at - NOW()), -2)::integer END AS todays_recommend_expense',
		);
		qb.leftJoin('budget.expends', 'expends');
		qb.leftJoin('budget.category', 'category');
		qb.where('budget.user = :userId', { userId: user.id });
		qb.andWhere('budget.endedAt >= now()');
		qb.groupBy('budget.id');
		qb.orderBy('todays_recommend_expense', 'DESC');

		const result = await qb.getRawMany();

		return result;
	}

	async find(user: User, dto: FindExpendsQueryDto) {
		return await this.findQueryBuilder(user, dto);
	}

	async update(user: User, dto: UpdateExpendDto, expendId: string) {
		return await this.expendsRepository.findOneAndUpdate(
			{
				user: {
					id: user.id,
				},
				id: expendId,
			},
			{
				expense: dto?.expense,
				except: dto?.except,
				memo: dto?.memo,
			},
		);
	}

	async delete(user: User, expendId: string) {
		return await this.expendsRepository.findOneAndDelete({
			id: expendId,
			user: {
				id: user.id,
			},
		});
	}

	private async findBudget(user: User, category: Categories) {
		const budget = await this.budgetsService.findOne({
			user: {
				id: user.id,
			},
			category: {
				name: category,
			},
		});

		if (!budget) throw new BadRequestException('존재하지않는 예산에 지출을 기록할 수 없습니다.');

		return budget;
	}

	private async findQueryBuilder(user: User, findExpendsQueryDto: FindExpendsQueryDto) {
		const { start, end, category, minExpense, maxExpense } = findExpendsQueryDto;
		const qb = this.entityManager
			.createQueryBuilder(Expend, 'expends')
			.select([
				'expends.id AS id',
				'expends.memo AS memo',
				'expends.expended_at AS expended_at',
				'expends.expense AS expense',
				'category.name',
				'expends.except AS except',
			])
			.leftJoin('expends.budget', 'budget')
			.leftJoin('budget.category', 'category')
			.where('expends.user = :userId', { userId: user.id })
			.andWhere('expends.expended_at BETWEEN :start AND :end', { start, end });

		if (category) {
			qb.andWhere('category.name = :category', { category });
		}

		if (minExpense) {
			qb.andWhere('expends.expense >= :minExpense', { minExpense });
		}

		if (maxExpense) {
			qb.andWhere('expends.expense <= :maxExpense', { maxExpense });
		}

		qb.groupBy('expends.id');
		qb.addGroupBy('expends.memo');
		qb.addGroupBy('expends.expended_at');
		qb.addGroupBy('category.name');

		const totalQb = this.entityManager
			.createQueryBuilder(Expend, 'expends')
			.select('coalesce(SUM(expends.expense), 0) as total_expense')
			.leftJoin('expends.budget', 'budget')
			.leftJoin('budget.category', 'category')
			.where('expends.user = :userId', { userId: user.id })
			.andWhere('expends.expended_at BETWEEN :start AND :end', { start, end })
			.andWhere('expends.except != true');

		if (category) {
			totalQb.andWhere('category.name = :category', { category });
		}

		if (minExpense) {
			totalQb.andWhere('expends.expense >= :minExpense', { minExpense });
		}

		if (maxExpense) {
			totalQb.andWhere('expends.expense <= :maxExpense', { maxExpense });
		}

		const result = await qb.getRawMany();
		const totalExpenseResult = await totalQb.getRawOne();

		result.push(totalExpenseResult);
		return result;
	}
}
