import { Categories } from './enum/category.enum';
import { Budget } from 'src/budgets/budget.entity';
import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends AbstractEntity<Category> {
	@Column({ unique: true })
	name: Categories;

	@OneToMany(() => Budget, (budget) => budget.category)
	budget: Budget[];
}
