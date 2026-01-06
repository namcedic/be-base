export interface IRegisterRequest {
	username: string
	firstName?: string
	lastName?: string
	email: string
	phone: string
	password: string
	rePassword: string
	readonly otp?: string
	readonly utmSource?: string
	readonly utmMedium?: string
	readonly utmCampaign?: string
	readonly utmContent?: string
	readonly utmTerm?: string
	readonly isOnlyship?: boolean
}
