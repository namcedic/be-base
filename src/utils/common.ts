export function fixImageSrc(description: string): string {
	return description.replace(/src="\/\/([^"]+)"/g, 'src="https://$1"')
}

export function cleanKeyword(keyword: string): string {
	if (!keyword) return keyword

	if (keyword.startsWith('PD_')) {
		return keyword.slice(3)
	}

	if (keyword.startsWith('DH #')) {
		return keyword.slice(4)
	}

	return keyword
}

export const toSnakeUpper = (s: string) =>
	(s || '')
		.trim()
		.toUpperCase()
		.replace(/[\s\-]+/g, '_')
		.replace(/[^\w_]/g, '')

export const truncateText = (text: string | undefined | null, maxLength = 1000): string => {
	if (!text) return ''
	const str = String(text)
	return str.length > maxLength ? str.slice(0, maxLength) : str
}

export function trimText(input?: string) {
	return input?.trim() || null
}

export function normalizeEmail(email?: string) {
	return email?.toLowerCase().trim() || null
}

export function normalizeUsername(username?: string) {
	return username?.toLowerCase().trim() || null
}

export function normalizePhone(phone?: string) {
	return trimText(phone)
}
