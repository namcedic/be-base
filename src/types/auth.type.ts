export enum AuthProvidersEnum {
	Email = 'email',
	Facebook = 'facebook',
	Apple = 'apple',
	Google = 'google'
}

export enum TokenType {
	ACCESS = 'access',
	REFRESH = 'refresh'
}

export interface AuthPayload {
	id: number
	roles: string[]
	session: string
}

export interface ForgotPasswordPayload {
	id: number
}
