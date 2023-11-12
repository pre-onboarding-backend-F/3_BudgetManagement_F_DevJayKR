import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
	ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class PastDayValidator implements ValidatorConstraintInterface {
	validate(value: string) {
		const isPastDay = new Date(value) > new Date();
		return isPastDay;
	}

	defaultMessage(): string {
		return `$property 필드는 현재 시간 이후만 설정 가능합니다.`;
	}
}

export function IsPastDay(validationOptions?: ValidationOptions) {
	return function (object: Record<string, any>, propertyName: string) {
		registerDecorator({
			name: 'IsPastDay',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: PastDayValidator,
		});
	};
}
