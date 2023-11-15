import { CreateExpendDto } from './dto/create-expend.dto';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ExpendsService } from './expends.service';
import { AtGuard } from 'src/auth/guards/at-auth.guard';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { User } from 'src/auth/users/user.entity';
import { FindExpendsQueryDto } from './dto/find-expends.dto';
import { UpdateExpendDto } from './dto/update-expend.dto';

@Controller('expends')
@UseGuards(AtGuard)
export class ExpendsController {
	constructor(private readonly expendsService: ExpendsService) {}

	@Post()
	async create(@CurrentUser() user: User, @Body() dto: CreateExpendDto) {
		return await this.expendsService.create(user, dto);
	}

	@Post('/recommend')
	async todayExpenseRecommend(@CurrentUser() user: User) {
		return await this.expendsService.todayExpenseRecommend(user);
	}

	@Get()
	async find(@CurrentUser() user: User, @Query() dto: FindExpendsQueryDto) {
		return await this.expendsService.find(user, dto);
	}

	@Put('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async update(@CurrentUser() user: User, @Body() dto: UpdateExpendDto, @Param('id') expendId: string) {
		return await this.expendsService.update(user, dto, expendId);
	}

	@Delete('/:id')
	async delete(@CurrentUser() user: User, @Param('id') expendId: string) {
		return await this.expendsService.delete(user, expendId);
	}
}
