import { Expose } from 'class-transformer';
import { User } from 'src/auth/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { Expend } from 'src/expends/expend.entity';
import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'budgets' })
export class Budget extends SoftDeleteEntity<Budget> {
	@ManyToOne(() => User, (user) => user.budgets, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Category, (category) => category.budget)
	@JoinColumn({ referencedColumnName: 'name', name: 'category_name' })
	category: Category;

	@Column({ comment: '만원 단위' })
	budget: number;

	@Column({ name: 'started_at' })
	@Expose({ name: 'started_at' })
	startedAt: Date;

	@Column({ name: 'ended_at' })
	@Expose({ name: 'ended_at' })
	endedAt: Date;

	@OneToMany(() => Expend, (expend) => expend.budget)
	expends: Expend[];
}
