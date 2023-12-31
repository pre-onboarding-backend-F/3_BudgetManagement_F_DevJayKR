import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { LocalGuard } from './guards/local-auth.guard';
import { User } from './users/user.entity';
import { RtGuard } from './guards/rt-auth.guard';
import { AtGuard } from './guards/at-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	@UseGuards(LocalGuard)
	async login(@Body() loginDto: LoginDto, @CurrentUser() user: User) {
		return await this.authService.login(user);
	}

	@Post('/refresh')
	@UseGuards(RtGuard)
	async refresh(@CurrentUser() user: User) {
		return await this.authService.refresh(user);
	}

	@Post('/logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(AtGuard)
	async logout(@CurrentUser() user: User) {
		return await this.authService.logout(user);
	}
}
