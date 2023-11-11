import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { AGE_GROUPS } from 'src/auth/users/constants/age-groups.constant';

export class CustomValidator {
	static IsNotEmpty() {
		return IsNotEmpty({ message: '$property 필드는 필수 입력 필드입니다.' });
	}

	static IsString() {
		return applyDecorators(
			IsString({ message: '$property 필드는 문자열이어야 합니다.' }),
			Transform(({ value }) => value?.trim()),
		);
	}

	static Length(min: number, max: number) {
		return Length(min, max, { message: '$property 필드는 $constraint1자 이상, $constraint2자 이하여야 합니다.' });
	}

	static IsUsername() {
		return applyDecorators(this.IsNotEmpty(), this.IsString(), this.Length(5, 12));
	}

	static IsPassword() {
		return applyDecorators(this.IsNotEmpty(), this.IsString(), this.Length(6, 20));
	}

	static IsKorean(min: number, max: number, message: string) {
		return Matches(new RegExp(`[가-힣]{${min},${max}}`), { message: `$property 필드는 ${message}` });
	}

	static IsKoreanName() {
		return applyDecorators(
			this.IsNotEmpty(),
			this.IsString(),
			this.IsKorean(2, 4, '2자 이상, 4자 이하의 한글 이름만 가능합니다.'),
		);
	}

	static IsInAgeGroup() {
		return applyDecorators(
			IsIn(AGE_GROUPS, {
				message: "$property 필드는 ['10대', '20대', '30대', '40대'] 중 하나의 값이어야 합니다.",
			}),
			Expose({ name: 'age_group' }),
		);
	}
}
