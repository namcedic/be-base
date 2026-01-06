export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test'
}

export type AuthConfig = {
	secretEncode: string
	secretReset: string
	secretAccess: string
	secretRefresh: string
	jwtPepper: string
}

export type AppConfig = {
	port: number
	env: Environment
	uploadMaxSize: number
	uploadMaxFile: number
}

export type DatabaseConfig = {
	host: string
	name: string
	username: string
	password: string
	port: number
	type: string
	synchronize: boolean
	runMigration: boolean
}

export type RedisConfig = {
	host: string
	port: number
	password?: string
}

export type MailConfig = {
	port: number
	host?: string
	user?: string
	password?: string
	defaultEmail?: string
	defaultName?: string
	ignoreTLS: boolean
	secure: boolean
	requireTLS: boolean
}

export type AllConfigType = {
	database: DatabaseConfig
	app: AppConfig
	auth: AuthConfig
	redis: RedisConfig
	// mail: MailConfig
}
