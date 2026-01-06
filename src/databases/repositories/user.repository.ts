import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { UserEntity } from '../entities/user.entity'
import { UserStatus } from '@app-types/user.type'

@Injectable()
export class UserRepository extends Repository<UserEntity> {
	constructor(
		@InjectRepository(UserEntity)
		repository: Repository<UserEntity>
	) {
		super(repository.target, repository.manager, repository.queryRunner)
	}

	private normalizeEmail(email?: string) {
		return email?.toLowerCase().trim() || null
	}

	private normalizeUsername(username?: string) {
		return username?.toLowerCase().trim() || null
	}

	private normalizePhone(phone?: string) {
		return phone?.trim() || null
	}

	findUserByEmail(email: string) {
		return this.findOne({ where: { email: this.normalizeEmail(email), status: UserStatus.ACTIVE } })
	}

	findUserByPhone(phone: string) {
		return this.findOne({ where: { phone: this.normalizePhone(phone), status: UserStatus.ACTIVE } })
	}

	findUserByUsername(username: string) {
		return this.findOne({ where: { username: this.normalizeUsername(username), status: UserStatus.ACTIVE } })
	}

	async updatePassword(id: number, hashedPassword: string) {
		return this.createQueryBuilder().update(UserEntity).set({ password: hashedPassword }).where('id = :id', { id }).execute()
	}

	async getSessionUser(userId: number): Promise<UserEntity | null> {
		return this.createQueryBuilder('u')
			.select([
				'u.id',
				'u.username',
				'u.email',
				'u.phone',
				'u.avatar',
				'u.firstName',
				'u.lastName',
				'u.status',
				'u.lastLogin',
				'u.createdAt',
				'u.createdAt',
				'u.deletedAt'
			])
			.where('u.id = :userId', { userId })
			.getOne()
	}
}
