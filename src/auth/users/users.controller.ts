import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { UsernameValidationPipe } from './pipes/username-validation.pipe';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async register(@Body(UsernameValidationPipe) createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto);
	}
}
