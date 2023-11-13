import { Test, TestingModule } from '@nestjs/testing';
import { ExpendsController } from '../../src/expends/expends.controller';
import { ExpendsService } from '../../src/expends/expends.service';

describe('ExpendsController', () => {
	let controller: ExpendsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ExpendsController],
			providers: [ExpendsService],
		}).compile();

		controller = module.get<ExpendsController>(ExpendsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
