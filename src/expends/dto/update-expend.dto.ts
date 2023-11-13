import { PickType } from '@nestjs/mapped-types';
import { CreateExpendDto } from './create-expend.dto';

export class UpdateExpendDto extends PickType(CreateExpendDto, ['except', 'memo', 'expense']) {}
