import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/auth/users/users.controller';
import { UsersService } from '../../src/auth/users/users.service';

describe('UsersController', () => {
	let controller: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService],
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
