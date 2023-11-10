import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async create(dto: CreateUserDto) {
		const newUser = new User(dto);

		await this.usersRepository.create(newUser);

		return await this.findOne({ username: dto.username });
	}

	async exist(where: FindOptionsWhere<User>) {
		return await this.usersRepository.exist(where);
	}

	async findOne(where: FindOptionsWhere<User>) {
		return await this.usersRepository.findOne(where);
	}

	async update(where: FindOptionsWhere<User>, partialEntity: QueryDeepPartialEntity<User>) {
		return await this.usersRepository.findOneAndUpdate(where, partialEntity);
	}
}
