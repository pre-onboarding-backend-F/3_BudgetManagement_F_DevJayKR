import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './category.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Category])],
	providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
