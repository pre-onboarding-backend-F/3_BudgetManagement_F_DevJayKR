import { IsNumberString } from 'class-validator';

export class RecommendBudgetDto {
	@IsNumberString()
	budget: number;
}
