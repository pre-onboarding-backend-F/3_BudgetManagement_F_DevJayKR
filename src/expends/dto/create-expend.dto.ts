import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Categories } from 'src/categories/enum/category.enum';
import { CustomValidator as CV } from 'src/global/classes/custom-validator.class';

export class CreateExpendDto {
	@CV.IsNotEmpty()
	@CV.IsNumberString()
	expense: number;

	@CV.IsDateString()
	@Expose({ name: 'expended_at' })
	expendedAt: Date;

	@IsOptional()
	@CV.IsString()
	memo: string;

	@CV.IsCategory()
	category: Categories;

	@IsOptional()
	@CV.IsBoolean()
	except: boolean = false;
}
