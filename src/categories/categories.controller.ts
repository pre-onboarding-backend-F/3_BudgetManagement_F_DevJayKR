import { Controller, Post, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/at-auth.guard';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesSevice: CategoriesService) {}

	@Post()
	@UseGuards(AtGuard)
	async find() {
		return await this.categoriesSevice.find();
	}
}
