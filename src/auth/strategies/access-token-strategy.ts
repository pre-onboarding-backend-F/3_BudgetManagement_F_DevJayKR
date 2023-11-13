import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfiguration from 'src/global/configs/jwt-configuration';
import { TokenPayload } from '../interfaces/token-payload';
import { User } from '../users/user.entity';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'access-token') {
	constructor(
		@Inject(jwtConfiguration.KEY)
		private readonly config: ConfigType<typeof jwtConfiguration>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.access.secretKey,
		});
	}

	async validate(payload: TokenPayload) {
		return {
			id: payload.id,
			username: payload.username,
			ageGroup: payload.ageGroup,
		} as User;
	}
}
