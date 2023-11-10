import jwtConfiguration from 'src/global/configs/jwt-configuration';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { FindOptionsWhere } from 'typeorm';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import { TokenPayload } from './interfaces/token-payload';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		@Inject(jwtConfiguration.KEY) private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
	) {}

	async validatePassword(password: string, encryptedPassword: string) {
		return await bcrypt.compare(password, encryptedPassword);
	}

	async login(user: User) {
		const payload = this.createTokenPayload(user);

		return {
			accessToken: await this.generateAccessToken(payload),
			refreshToken: await this.generateRefreshToken(payload),
		};
	}

	async refresh(user: User) {
		const payload = this.createTokenPayload(user);

		return {
			accessToken: await this.generateAccessToken(payload),
		};
	}

	async logout(user: User): Promise<void> {
		await this.usersService.update({ id: user.id }, { refreshToken: null });
	}

	private createTokenPayload(user: User): TokenPayload {
		return {
			id: user.id,
			username: user.username,
			ageGroup: user.ageGroup,
		};
	}

	private async generateAccessToken(payload: TokenPayload) {
		return this.jwtService.signAsync(payload, {
			secret: this.jwtConfig.access.secretKey,
			expiresIn: this.jwtConfig.access.expirationTimeAsSecond,
		});
	}

	private async generateRefreshToken(payload: TokenPayload) {
		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: this.jwtConfig.refresh.secretKey,
			expiresIn: this.jwtConfig.refresh.expirationTimeAsSecond,
		});

		await this.setRefreshToken({ id: payload.id }, refreshToken);

		return refreshToken;
	}

	private async setRefreshToken(where: FindOptionsWhere<User>, refreshToken: string): Promise<void> {
		await this.usersService.update(where, { refreshToken });
	}
}
