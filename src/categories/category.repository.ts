import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'src/global/common/abstract.repository';
import { Category } from './category.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
	protected readonly logger = new Logger(CategoriesRepository.name);

	constructor(
		@InjectRepository(Category)
		private readonly categoriesRepository: Repository<Category>,
		entityManager: EntityManager,
	) {
		super(categoriesRepository, entityManager);
	}
}
