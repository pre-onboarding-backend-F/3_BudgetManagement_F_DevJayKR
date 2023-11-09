import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto';
import { User } from './user.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async create(dto: CreateUserDto) {
		const newUser = new User({
			...dto,
			ageGroup: dto.age_group,
		});

		await this.usersRepository.create(newUser);
	}

	async exist(where: FindOptionsWhere<User>) {
		return await this.usersRepository.exist(where);
	}

	async findOne(where: FindOptionsWhere<User>) {
		return await this.usersRepository.findOne(where);
	}

	async find() {}
	async delete() {}
}
