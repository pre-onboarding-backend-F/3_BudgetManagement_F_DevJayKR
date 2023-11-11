import { ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions/validation-exception';

export const validationExceptionFactory = (errors: ValidationError[]) => {
	const formatError = (errors: ValidationError[]) => {
		const errMsg = {};
		errors.forEach((error: ValidationError) => {
			errMsg[error.property] = error.children.length
				? [formatError(error.children)]
				: [...Object.values(error.constraints)];
		});
		return errMsg;
	};
	return new ValidationException(formatError(errors));
};
