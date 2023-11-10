import { CustomValidator as CV } from 'src/global/classes/custom-validator.class';

export class CreateUserDto {
	@CV.IsUsername()
	username: string;

	@CV.IsPassword()
	password: string;

	@CV.IsKoreanName()
	name: string;

	@CV.IsInAgeGroup()
	ageGroup: string;
}
