import { ParserType } from '@app-types/common'

export const SERVICE_PREFIX = 'api/sena'
export const SERVICE_NAME = 'CamboApplication'
export const TOKEN_TYPE = {
	ACCESS: {
		TEXT: 'ACCESS',
		EXPIRES: 30
	},
	REFRESH: {
		TEXT: 'REFRESH',
		EXPIRES: 90
	},
	RESET: {
		TEXT: 'RESET',
		EXPIRES: 5
	}
}

export const LEVELS = {
	ERROR: 'error',
	WARN: 'warn',
	INFO: 'info',
	DEBUG: 'debug'
}

export const HEADERS = {
	'access-key': 'HEADER_ACCESS_KEY',
	signature: 'HEADER_SIGNATURE',
	timestamp: 'HEADER_TIMESTAMP',
	'nonce-str': 'HEADER_NONCE_STR'
}

export const PARSER_TYPES: Record<string, ParserType> = {
	N: 'null',
	i: 'int',
	d: 'float',
	b: 'boolean',
	s: 'string',
	a: 'array-object',
	C: 'serializable-class',
	O: 'notserializable-class'
}
export const SYSTEM = 'system'
export const KEYWORD_PREFIX = 'BATCHING_KEYWORD'
export const KEYWORD_EXPIRE = 60 * 60

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const EXPIRES = {
	REGISTER: 10 * 60,
	RESET: 3 * 60,
	SEARCH_IMAGE: 5 * 60
}

export const SENDABLE = {
	SMS: 'SMS',
	EMAIL: 'EMAIL',
	LINK: 'LINK'
}

export const DPOP_ERROR_CODE = {
	MISSING_DPOP_HEADER: 'd_x000',
	INVALID_SIGNATURE: 'd_x001',
	INVALID_SIGNATURE_FORMAT: 'd_x010',
	MISSING_PUBLIC_KEY: 'd_x002',
	MISSING_JWT_ID: 'd_x003',
	MISSING_JWT_ID_SIGNATURE: 'd_x004',
	INVALID_JWT_ID_FORMAT: 'd_x005',
	JWT_ID_WAS_USED: 'd_x006',
	INVALID_ENDPOINT: 'd_x007',
	INVALID_IAT: 'd_x008',
	INVALID_JWT_SIGNATURE: 'd_x009',
	EXCEPTION: 'd_x999'
}

export const FILE_TYPE = {
	AVATAR: 'avatar',
	COMPLAIN: 'complain',
	COMMON: 'common'
}

export const DEVICE_TYPE = {
	IOS: 'IOS',
	ANDROID: 'ANDROID',
	OTHER: 'OTHER'
}

export const ONEMINUTE = 60
export const ONEHOUR = 60 * ONEMINUTE
export const ONEDAY = 24 * ONEHOUR
export const ONEWEEK = 7 * ONEDAY
export const ONEMONTH = 30 * ONEDAY
export const ONEYEAR = 365 * ONEDAY

export const TIME_UNITS = [
	{ unit: ONEYEAR, label: 'năm' },
	{ unit: ONEMONTH, label: 'tháng' },
	{ unit: ONEWEEK, label: 'tuần' },
	{ unit: ONEDAY, label: 'ngày' },
	{ unit: ONEHOUR, label: 'giờ' },
	{ unit: ONEMINUTE, label: 'phút' }
]

export const NOTIFICATION_ACTIONS = {
	VIEW_ALL: 'VIEW_ALL',
	VIEW_ONLY: 'VIEW_ONLY'
}

export const REQUEST_FROM = {
	APP_IOS: 'APP_IOS',
	APP_ANDROID: 'APP_ANDROID',
	WEB: 'WEB'
}

export const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	maxAge: 30 * 60 * 1000, // 30 minutes
	domain: '.senaskin.vn',
	path: '/',
	sameSite: 'none'
}

export const SITES = []
