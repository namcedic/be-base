import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { DatabaseConfig } from './config.type'
import { registerAs } from '@nestjs/config'
import validateConfig from '../commons/utils/validate-config'

class EnvironmentVariablesValidator {
	@IsString()
	DB_HOST: string

	@IsInt()
	@Min(0)
	@Max(65535)
	DB_PORT: number

	@IsString()
	DB_USERNAME: string

	@IsString()
	DB_PASSWORD: string

	@IsString()
	DB_DATABASE: string

	@IsString()
	@IsOptional()
	DB_TYPE: string

	@IsString()
	@IsOptional()
	DB_SYNCHRONIZE: string
}

export default registerAs<DatabaseConfig>('database', () => {
	validateConfig(process.env, EnvironmentVariablesValidator)

	return {
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT || '3306'),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		name: process.env.DB_DATABASE,
		type: process.env.DB_TYPE || 'mysql',
		synchronize: process.env.DB_SYNCHRONIZE === 'true',
		runMigration: process.env.DB_RUN_MIGRATION === 'true'
	}
})
