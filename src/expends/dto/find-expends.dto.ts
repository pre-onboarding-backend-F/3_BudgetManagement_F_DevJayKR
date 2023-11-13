import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Categories } from 'src/categories/enum/category.enum';
import { CustomValidator as CV } from 'src/global/classes/custom-validator.class';

export class FindExpendsQueryDto {
	@CV.IsDateString()
	start: Date;

	@CV.IsDateString()
	end: Date;

	@IsOptional()
	@CV.IsCategory()
	category: Categories;

	@IsOptional()
	@Expose({ name: 'min_expense' })
	minExpense: number;

	@IsOptional()
	@Expose({ name: 'max_expense' })
	maxExpense: number = 10000;
}
