import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import { AGE_GROUPS } from '../constants';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@Matches(/[가-힣]{1-4}/)
	@IsNotEmpty()
	name: string;

	@IsIn(AGE_GROUPS)
	age_group: string;
}
