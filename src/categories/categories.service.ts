import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesRepository } from './category.repository';
import { Category } from './category.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export class CategoriesService implements OnModuleInit {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	private categories = ['고정', '생활', '교통', '의료', '문화', '여행', '교육'];

	async onModuleInit() {
		const isExist = this.categoriesRepository.exist({
			name: '고정',
		});

		if (!isExist) {
			for (const category of this.categories) {
				const newCategory = new Category({
					name: category,
				});

				this.categoriesRepository.create(newCategory);
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
