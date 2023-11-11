import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesRepository } from './category.repository';
import { Category } from './category.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { Categories } from './enum/category.enum';

@Injectable()
export class CategoriesService implements OnModuleInit {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async onModuleInit() {
		const isExist = await this.find({
			take: 1,
		});

		if (isExist.length <= 0) {
			for (const category of Object.values(Categories)) {
				const newCategory = new Category({
					name: category,
				});
				await this.categoriesRepository.create(newCategory);
			}
		}
	}

	async findOne(where: FindOptionsWhere<Category>) {
		return await this.categoriesRepository.findOne(where);
	}

	async find(options?: FindManyOptions<Category>) {
		return await this.categoriesRepository.find(options);
	}
}
