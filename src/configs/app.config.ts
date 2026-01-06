import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'
import { AppConfig, Environment } from './config.type'
import { registerAs } from '@nestjs/config'
import validateConfig from '../commons/utils/validate-config'
import * as process from 'process'

class EnvironmentVariablesValidator {
	@IsEnum(Environment)
	@IsOptional()
	NODE_ENV: Environment

	@IsInt()
	@Min(0)
	@Max(65535)
	@IsOptional()
	PORT: number

	@IsInt()
	@Min(0)
	UPLOAD_MAX_SIZE: number

	@IsInt()
	@Min(0)
	UPLOAD_MAX_FILE: number
}

export default registerAs<AppConfig>('app', () => {
	validateConfig(process.env, EnvironmentVariablesValidator)

	return {
		env: (process.env.NODE_ENV as Environment) || Environment.Development,
		port: process.env.PORT ? parseInt(process.env.PORT, 10) : process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
		uploadMaxSize: process.env.UPLOAD_MAX_SIZE ? parseInt(process.env.UPLOAD_MAX_SIZE) : 1024 * 1024 * 10,
		uploadMaxFile: process.env.UPLOAD_MAX_FILE ? parseInt(process.env.UPLOAD_MAX_FILE) : 1
	}
})
