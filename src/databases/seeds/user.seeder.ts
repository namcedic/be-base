import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { UserEntity } from '@databases/entities/user.entity'
import { UserStatus } from '@app-types/user.type'

export default class UserSeeder implements Seeder {
	public async run(ds: DataSource): Promise<any> {
		console.log('Database seeder 👊')
		await ds.manager.transaction(async (transactionalEntityManager) => {
			for (let i = 0; i < 10; i++) {
				const password = 'Admin@123'
				await transactionalEntityManager.save(UserEntity, {
					email: `user${i}@example.com`,
					password,
					status: UserStatus.ACTIVE
				})
			}
		})
	}
}
