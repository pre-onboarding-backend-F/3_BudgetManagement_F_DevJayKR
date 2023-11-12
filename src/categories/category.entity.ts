import { Exclude } from 'class-transformer';
import { Categories } from './enum/category.enum';
import { Budget } from 'src/budgets/budget.entity';
import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends AbstractEntity<Category> {
	@Column({ unique: true })
	name: Categories;

	@OneToOne(() => Budget, (budget) => budget.category)
	budget: Budget;

	@Exclude()
	id: string;

	@Exclude()
	createdAt: Date;

	@Exclude()
	updatedAt: Date;
}
