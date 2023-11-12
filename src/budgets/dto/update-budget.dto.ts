import { PickType } from '@nestjs/mapped-types';
import { CreateBudgetDto } from './create-budget.dto';
import { IsDateString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateBudgetDto extends PickType(CreateBudgetDto, ['budget'] as const) {
	@IsDateString()
	@IsOptional()
	@Expose({ name: 'started_at' })
	startedAt: string;
}
