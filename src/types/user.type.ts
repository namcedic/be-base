export enum UserRoleEnum {
	Admin = 'admin',
	User = 'user'
}

export enum UserStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	PENDING = 'pending',
	DELETED = 'deleted'
}

export enum EmailStatus {
	NOT_REGISTER = 'NOT_REGISTER',
	BANNED = 'BANNED',
	REGISTED = 'REGISTED'
}

export const MAX_USER_SEARCH_NUMBER = 6

export enum DeviceOS {
	IOS = 'IOS',
	ANDROID = 'ANDROID',
	UNKNOWN = 'UNKNOWN'
}

export enum UserGender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	NON_BINARY = 'NON_BINARY',
	PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}
