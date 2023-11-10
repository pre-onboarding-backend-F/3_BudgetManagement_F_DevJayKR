import { IsIn, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { AGE_GROUPS } from '../constants/age-groups.constant';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@Length(4, 12)
	username: string;

	@IsString()
	@IsNotEmpty()
	@Length(6, 20)
	password: string;

	@IsString()
	@Matches(/[가-힣]{2,4}/)
	@IsNotEmpty()
	name: string;

	@IsIn(AGE_GROUPS)
	@Expose({ name: 'age_group' })
	ageGroup: string;
}
