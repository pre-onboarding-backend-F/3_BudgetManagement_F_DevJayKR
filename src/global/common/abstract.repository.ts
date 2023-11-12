import { Logger } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { EntityManager, FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
	protected abstract readonly logger: Logger;

	constructor(
		private readonly entityRepository: Repository<T>,
		private readonly entityManager: EntityManager,
	) {}

	async exist(where: FindOptionsWhere<T>): Promise<boolean> {
		return this.entityRepository.exist({ where });
	}

	async create(entity: T): Promise<T> {
		return this.entityRepository.save(entity);
	}

	async findOne(where: FindOptionsWhere<T>, relations?: FindOptionsRelations<T>): Promise<T> {
		const entity = await this.entityRepository.findOne({ where, relations });

		return entity;
	}

	async findOneAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T> {
		await this.entityRepository.update(where, partialEntity);

		return this.findOne(where);
	}

	async findBy(where?: FindOptionsWhere<T>) {
		return this.entityRepository.findBy(where);
	}

	async find(options?: FindManyOptions<T>) {
		return this.entityRepository.find(options);
	}

	async findOneAndSoftDelete(where: FindOptionsWhere<T>) {
		await this.entityRepository.softDelete(where);
	}

	async findOneAndDelete(where: FindOptionsWhere<T>) {
		await this.entityRepository.delete(where);
	}
}
