import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { BudgetsRepository } from './budgets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './budget.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
	imports: [TypeOrmModule.forFeature([Budget]), CategoriesModule],
	controllers: [BudgetsController],
	providers: [BudgetsService, BudgetsRepository],
})
export class BudgetsModule {}
