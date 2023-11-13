import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { AGE_GROUPS } from './constants/age-groups.constant';
import { Budget } from 'src/budgets/budget.entity';
import { Expend } from 'src/expends/expend.entity';

@Entity({ name: 'users' })
export class User extends SoftDeleteEntity<User> {
	@Column()
	name: string;

	@Column({ name: 'age_group', enum: AGE_GROUPS })
	@Expose({ name: 'age_group' })
	ageGroup: string;

	@Column({ unique: true })
	username: string;

	@Column()
	@Exclude()
	password: string;

	@Column({ name: 'refresh_token', nullable: true })
	@Exclude()
	refreshToken: string;

	@OneToMany(() => Budget, (budget) => budget.user)
	budgets: Budget[];

	@OneToMany(() => Expend, (expend) => expend.user)
	expends: Expend[];

	@BeforeInsert()
	async encryption() {
		const password = await bcrypt.hash(this.password, 10);
		this.password = password;
	}
}
