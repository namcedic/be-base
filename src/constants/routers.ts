const METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE'
}

export const RoutersApplyOptional: { [key: string]: string[] } = {
	'/customer/device/token': [METHODS.POST],
	'/vouchers/all': [METHODS.GET]
}

export const RoutersExclude: { [key: string]: string[] } = {
	'/health': [METHODS.GET],
	'/health/sentry-check': [METHODS.GET],
	'/health/sitemap': [METHODS.GET],
	'/translate': [METHODS.POST],

	'/sitemap': [METHODS.GET],
	'/auth/register': [METHODS.POST],
	'/auth/login': [METHODS.POST],
	'/auth/refresh': [METHODS.POST],
	'/auth/change-password': [METHODS.POST],
	'/auth/password/reset': [METHODS.POST],

	'/sso/google': [METHODS.GET],
	'/sso/google/redirect': [METHODS.GET],
	'/sso/google/callback': [METHODS.POST],
	'/sso/facebook': [METHODS.GET],
	'/sso/facebook/redirect': [METHODS.GET]
}

export const RoutersWithAlias: { [key: string]: string[] } = {
	'/articleby': [METHODS.GET]
}
