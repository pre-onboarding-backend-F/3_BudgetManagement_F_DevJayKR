import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { AtGuard } from 'src/auth/guards/at-auth.guard';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { User } from 'src/auth/users/user.entity';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { RecommendBudgetDto } from './dto/recommend-budget.dto';

@Controller('budgets')
@UseGuards(AtGuard)
export class BudgetsController {
	constructor(private readonly budgetsService: BudgetsService) {}

	@Post()
	async create(@Body() createBudgetDto: CreateBudgetDto, @CurrentUser() user: User) {
		return await this.budgetsService.create(createBudgetDto, user);
	}

	@Get()
	async find(@CurrentUser() user: User) {
		return await this.budgetsService.find(user);
	}

	@Post('/recommend')
	async recommend(@CurrentUser() user: User, @Body() recommendBudgetDto: RecommendBudgetDto) {
		return await this.budgetsService.setRecommend(user, recommendBudgetDto);
	}

	@Put('/:id')
	async update(
		@Body() updateBudgetDto: UpdateBudgetDto,
		@CurrentUser() user: User,
		@Param('id', new ParseUUIDPipe()) id: string,
	) {
		return await this.budgetsService.update(updateBudgetDto, user, id);
	}

	@Delete('/:id')
	@HttpCode(204)
	async delete(@CurrentUser() user: User, @Param('id', new ParseUUIDPipe()) id: string) {
		return await this.budgetsService.delete(user, id);
	}
}
