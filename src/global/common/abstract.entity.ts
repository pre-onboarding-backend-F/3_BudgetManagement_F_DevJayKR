import { Exclude, Expose } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity<T> {
	constructor(entity: Partial<T>) {
		Object.assign(this, entity);
	}

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	@Expose({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ default: null })
	@Expose({ name: 'updated_at' })
	updatedAt: Date;
}

export class SoftDeleteEntity<T> extends AbstractEntity<T> {
	@DeleteDateColumn({ default: null })
	@Exclude()
	deletedAt: Date;
}
