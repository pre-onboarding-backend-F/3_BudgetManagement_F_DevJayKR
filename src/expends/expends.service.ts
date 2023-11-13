import { FindExpendsQueryDto } from './dto/find-expends.dto';
import { User } from 'src/auth/users/user.entity';
import { ExpendsRepository } from './expends.repository';
import { Injectable } from '@nestjs/common';
import { CreateExpendDto } from './dto/create-expend.dto';
import { Expend } from './expend.entity';
import { Budget } from 'src/budgets/budget.entity';
import { EntityManager } from 'typeorm';
import { UpdateExpendDto } from './dto/update-expend.dto';

@Injectable()
export class ExpendsService {
	constructor(
		private readonly expendsRepository: ExpendsRepository,
		private readonly entityManager: EntityManager,
	) {}

	async create(user: User, dto: CreateExpendDto, budget: Budget) {
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
