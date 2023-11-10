import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfiguration from 'src/global/configs/jwt-configuration';
import { TokenPayload } from '../interfaces/token-payload';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh-token') {
	constructor(
		@Inject(jwtConfiguration.KEY)
		private readonly config: ConfigType<typeof jwtConfiguration>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.refresh.secretKey,
		});
	}

	async validate(payload: TokenPayload) {
		return payload;
	}
}
