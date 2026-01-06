export interface IHeaders {
	headers: ICommons
}

export interface ICommons {
	'Content-Type'?: string
	Accept?: string
	Connection?: string
	'access-key': string
	signature: string
	timestamp: string
	'user-id': string
	'nonce-str': string
}
