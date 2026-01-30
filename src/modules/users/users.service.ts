import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@databases/entities/user.entity'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserRepository } from '@databases/repositories/user.repository'
import { QueryUsersDto } from './dtos/query-users.dto'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly usersRepo: Repository<UserEntity>,
		private readonly userRepositoryCustom: UserRepository
	) {}

	create(dto: CreateUserDto) {
		const user = this.usersRepo.create(dto)
		return this.usersRepo.save(user)
	}

	async findAll(query: QueryUsersDto) {
		return this.userRepositoryCustom.findAndPaginate(query)
	}

	async findOne(id: number) {
		const user = await this.usersRepo.findOne({ where: { id } })
		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async update(id: number, dto: Partial<CreateUserDto>) {
		await this.findOne(id)
		await this.usersRepo.update(id, dto)
		return this.findOne(id)
	}

	async remove(id: number) {
		await this.findOne(id)
		await this.usersRepo.softDelete(id)
		return { deleted: true }
	}
}
