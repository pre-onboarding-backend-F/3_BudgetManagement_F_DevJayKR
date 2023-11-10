import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsUsernameExistPipe } from 'src/auth/users/pipes/is-username-exist.pipe';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async register(@Body(IsUsernameExistPipe) createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto);
	}
}
