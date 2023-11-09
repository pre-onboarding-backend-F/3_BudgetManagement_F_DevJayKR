import { SoftDeleteEntity } from 'src/global';
import { Column, Entity } from 'typeorm';
import { AGE_GROUPS } from './constants';

@Entity({ name: 'users' })
export class User extends SoftDeleteEntity<User> {
	@Column()
	name: string;

	@Column({ name: 'age_group', enum: AGE_GROUPS })
	ageGroup: string;

	@Column()
	username: string;

	@Column()
	password: string;
}
