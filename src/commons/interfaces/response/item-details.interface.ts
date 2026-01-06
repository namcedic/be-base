interface ICategory {
	id: string
	path: string
	name: string
}

interface IStore {
	id: number
	name: string
	account: string
	url?: string
}

interface ISkuObject {
	[key: string]: any
}

interface IPropValue {
	valueID: string
	valueName: string
}

interface ISkuProperty {
	propID: number
	propName: string
	propValues: IPropValue[]
}

interface IClassify {
	skuImages: ISkuObject
	skuProperties: ISkuProperty[]
	skuMappings: ISkuObject
}

export interface IItemDetailsResponse {
	id: number
	name: string
	description: string
	quantity: number
	category: ICategory
	currency: string
	price: number
	promotionPrice: number
	url: string
	thumbnails: string[] | null
	store: IStore
	classify: IClassify
	productInfos?: any[]
	maxOrderWithNoSKU?: number | null
}
