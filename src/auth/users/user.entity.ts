import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { SoftDeleteEntity } from 'src/global/common/abstract.entity';
import { AGE_GROUPS } from './constants/age-groups.constant';

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

	@BeforeInsert()
	async encryption() {
		const password = await bcrypt.hash(this.password, 10);
		this.password = password;
	}
}
