import { BadRequestException, Injectable, Delete } from '@nestjs/common';
import { User } from './user.entity';
import { FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async create(dto: CreateUserDto) {
		await this.validateUserExist(dto.username);

		const newUser = new User(dto);
		await this.usersRepository.create(newUser);

		return await this.findOne({ username: dto.username });
	}

	async findOne(where: FindOptionsWhere<User>) {
		return await this.usersRepository.findOne(where);
	}

	async update(where: FindOptionsWhere<User>, partialEntity: QueryDeepPartialEntity<User>) {
		return await this.usersRepository.findOneAndUpdate(where, partialEntity);
	}

	async deleteAll() {
		return await this.usersRepository.deleteAll();
	}

	private async validateUserExist(username: string) {
		const user = await this.usersRepository.exist({ username });

		if (user) {
			throw new BadRequestException('이미 존재하는 유저네임입니다.');
		}
	}
}
