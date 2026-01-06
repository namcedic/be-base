import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({
	path: path.join(__dirname, '../../.env')
})

export const typeOrmConfig: TypeOrmModuleOptions & {
	seeds: string[]
	factories: string[]
} = {
	type: (process.env.DB_TYPE as any) || 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '3306'),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	synchronize: process.env.DB_SYNCHRONIZE === 'true',
	dropSchema: false,
	keepConnectionAlive: true,
	namingStrategy: new SnakeNamingStrategy(),
	logging: false,
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
	subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
	migrationsRun: process.env.DB_RUN_MIGRATION === 'true',
	seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
	factories: [__dirname + '/factories/**/*{.ts,.js}']
}
