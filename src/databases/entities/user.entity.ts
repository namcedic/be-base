import { Exclude } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'
import { BaseEntity } from './base.entity'
import { UserStatus } from '@app-types/user.type'

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number

	@Index({ unique: true })
	@Column({ type: 'varchar', length: 100, nullable: false })
	username: string

	@Index({ unique: true })
	@Column({ type: 'varchar', length: 255, nullable: true })
	email: string | null

	@Index({ unique: true })
	@Column({ type: 'varchar', length: 30, nullable: true })
	phone: string | null

	@Column({
		type: 'datetime',
		nullable: true
	})
	lastLogin?: Date | null

	@Column({ type: 'text', nullable: false })
	@Exclude({ toPlainOnly: true })
	password?: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	avatar: string | null

	@Column({ type: 'text', nullable: true })
	firstName?: string

	@Column({ type: 'text', nullable: true })
	lastName?: string

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.PENDING
	})
	status: UserStatus = UserStatus.PENDING
}
