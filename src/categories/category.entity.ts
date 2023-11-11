import { AbstractEntity } from 'src/global/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories ' })
export class Category extends AbstractEntity<Category> {
	@Column({ unique: true })
	name: string;
}
