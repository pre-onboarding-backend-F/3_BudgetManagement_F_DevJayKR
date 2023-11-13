import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/global/common/abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Expend } from './expend.entity';

@Injectable()
export class ExpendsRepository extends AbstractRepository<Expend> {
	protected readonly logger = new Logger(ExpendsRepository.name);

	constructor(
		@InjectRepository(Expend)
		expendsRepository: Repository<Expend>,
		entityManager: EntityManager,
	) {
		super(expendsRepository, entityManager);
	}
}
