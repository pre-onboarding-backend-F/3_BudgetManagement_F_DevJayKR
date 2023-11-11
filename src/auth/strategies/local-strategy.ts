import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
	) {
		super();
	}

	async validate(username: string, password: string): Promise<User> {
		const user = await this.usersService.findOne({ username });

		if (!user) {
			throw new NotFoundException('존재하지않는 유저네임입니다.');
		}

		const isMatched = await this.authService.validatePassword(password, user.password);

		if (!isMatched) {
			throw new BadRequestException('비밀번호가 틀렸습니다.');
		}

		return user;
	}
}
