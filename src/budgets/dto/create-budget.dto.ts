import { Categories } from 'src/categories/enum/category.enum';
import { CustomValidator as CV } from 'src/global/classes/custom-validator.class';

export class CreateBudgetDto {
	@CV.IsCategory()
	category: Categories;

	@CV.IsBudget()
	budget: number;

	@CV.IsStartedAt()
	startedAt: string;
}
