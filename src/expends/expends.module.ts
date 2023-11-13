import { Module } from '@nestjs/common';
import { ExpendsService } from './expends.service';
import { ExpendsController } from './expends.controller';
import { ExpendsRepository } from './expends.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expend } from './expend.entity';
import { BudgetsModule } from 'src/budgets/budgets.module';

@Module({
	imports: [TypeOrmModule.forFeature([Expend]), BudgetsModule],
	controllers: [ExpendsController],
	providers: [ExpendsService, ExpendsRepository],
})
export class ExpendsModule {}
