import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { RedisConfig } from './config.type'
import { registerAs } from '@nestjs/config'
import validateConfig from '../commons/utils/validate-config'

class EnvironmentVariablesValidator {
	@IsString()
	REDIS_HOST: string

	@IsInt()
	@Min(0)
	@Max(65535)
	@IsOptional()
	REDIS_PORT: number

	@IsString()
	@IsOptional()
	REDIS_PASSWORD: string
}

export default registerAs<RedisConfig>('redis', () => {
	validateConfig(process.env, EnvironmentVariablesValidator)

	return {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT),
		password: process.env.REDIS_PASSWORD
	}
})
