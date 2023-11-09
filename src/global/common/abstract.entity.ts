import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class AbstractEntity<T> {
	constructor(entity: Partial<T>) {
		Object.assign(this, entity);
	}

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn({ default: null })
	modifiedDate: Date;
}

export class SoftDeleteEntity<T> extends AbstractEntity<T> {
	@DeleteDateColumn({ default: null })
	deletedDate: Date;
}
