import { IsString } from 'class-validator'

import { AuthConfig } from './config.type'
import { registerAs } from '@nestjs/config'
import * as process from 'process'
import validateConfig from '../commons/utils/validate-config'

class EnvironmentVariablesValidator {
	@IsString()
	JWT_SECRET_ENCODE: string

	@IsString()
	JWT_SECRET_RESET: string

	@IsString()
	JWT_SECRET_ACCESS: string

	@IsString()
	JWT_SECRET_REFRESH: string

	@IsString()
	JWT_PEPPER: string
}

export default registerAs<AuthConfig>('auth', () => {
	validateConfig(process.env, EnvironmentVariablesValidator)

	return {
		secretEncode: process.env.JWT_SECRET_ENCODE,
		secretReset: process.env.JWT_SECRET_RESET,
		secretAccess: process.env.JWT_SECRET_ACCESS,
		secretRefresh: process.env.JWT_SECRET_REFRESH,
		jwtPepper: process.env.JWT_PEPPER
	}
})
