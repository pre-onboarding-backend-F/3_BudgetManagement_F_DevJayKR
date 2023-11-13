import { Expose } from 'class-transformer';
import { User } from 'src/auth/users/user.entity';
import { Budget } from 'src/budgets/budget.entity';
import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'expends' })
export class Expend extends AbstractEntity<Expend> {
	@Column()
	expense: number;

	@Column({ name: 'expended_at' })
	@Expose({ name: 'expended_at' })
	expendedAt: Date;

	@Column({ type: 'text', nullable: true })
	memo: string;

	@Column({ type: 'boolean', default: false })
	except: boolean;

	@ManyToOne(() => User, (user) => user.expends)
	user: User;

	@ManyToOne(() => Budget, (budget) => budget.expends, {
		onDelete: 'CASCADE',
	})
	budget: Budget;
}
