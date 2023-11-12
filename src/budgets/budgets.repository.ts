import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/global/common/abstract.repository';
import { Budget } from './budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class BudgetsRepository extends AbstractRepository<Budget> {
	protected readonly logger = new Logger(BudgetsRepository.name);

	constructor(
		@InjectRepository(Budget)
		budgetsRepository: Repository<Budget>,
		entityManager: EntityManager,
	) {
		super(budgetsRepository, entityManager);
	}

	async findOneAndUpdate(where: FindOptionsWhere<Budget>, partialEntity: QueryDeepPartialEntity<Budget>) {
		await super.findOneAndUpdate(where, partialEntity);

		return await super.findOne(where, {
			category: true,
		});
	}
}
