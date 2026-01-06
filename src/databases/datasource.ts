import * as path from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'
import * as process from 'process'
import * as dotenv from 'dotenv'
import 'reflect-metadata'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import 'tsconfig-paths/register'

dotenv.config({
	path: path.join(__dirname, '../../.env')
})

const datasource = new DataSource({
	type: (process.env.DB_TYPE as any) || 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '3306'),
	database: process.env.DB_DATABASE,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
	namingStrategy: new SnakeNamingStrategy()
} as DataSourceOptions)

export default datasource
