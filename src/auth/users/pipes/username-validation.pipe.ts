import { PipeTransform, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto';

@Injectable()
export class UsernameValidationPipe implements PipeTransform {
	constructor(private usersService: UsersService) {}

	async transform(value: CreateUserDto) {
		const username = value.username;

		const isExist = await this.usersService.exist({ username });
		if (isExist) throw new UnprocessableEntityException('이미 존재하는 유저네임입니다.');

		return value;
	}
}
