export type Options = {
	strict: boolean
	encoding: BufferEncoding
}

export type ParserType =
	| 'null'
	| 'int'
	| 'float'
	| 'boolean'
	| 'string'
	| 'array-object'
	| 'serializable-class'
	| 'notserializable-class'

export type Refund = {
	order: number
	credit: number
	paid: number
	customer: number
	invoice: string
	ref: any
}

export type PossibleThings = {
	[key: string]: boolean | string | number
}

export type SkuOfItem = {
	provider: string
	quantity: number
	skus: string[]
	quantities: number[]
	skuImages?: Record<string, string>
}

export type Skus = {
	[key: string]: SkuOfItem
}

export type SkuMapping = {
	skuID: string
	sName: string
	price: number
	promotionPrice: number
	quantity: number
	transportFee: number
	imageURL: string
	status: boolean
	amountOnSale: number
}

export type ParametersOfAddress = {
	name: string
	phone: string
	address: string
	cityID: number | null
	districtID: number | null
	wardID: number | null
}

export type Balance = {
	credit: number
	creditFreeze: number
}

// export interface TextCollector {
// 	textsToTranslate: string[]
// 	mapping: { [key: string]: string }
// 	uniqueTextToKeys: { [text: string]: string[] }
// }
