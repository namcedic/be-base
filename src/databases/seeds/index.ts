import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import UserSeeder from './user.seeder'

export default class DBSeeder implements Seeder {
	public async run(ds: DataSource): Promise<any> {
		console.log('🚀 Seed start')

		await new UserSeeder().run(ds)
		console.log('🚀  Seed completed')
	}
}
