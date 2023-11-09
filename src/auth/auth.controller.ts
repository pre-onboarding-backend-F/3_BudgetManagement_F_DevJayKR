import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	async login() {}
	async refresh() {}
	async logout() {}
}
