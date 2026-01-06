import { DATE_FORMAT } from '@constants/constant'
import * as crypto from 'crypto'
import * as moment from 'moment-timezone'

export class Utils {
	static slugify(string, ignoreNums = true) {
		const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
		const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
		const p = new RegExp(a.split('').join('|'), 'g')
		const str = string
			.toString()
			.toLowerCase()
			.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
			.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
			.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
			.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
			.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
			.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
			.replace(/đ/gi, 'd')
			.replace(/\s+/g, '')
			.replace(p, (c) => b.charAt(a.indexOf(c)))
			.replace(/&/g, '-and-')
			.replace(/[^\w\-]+/g, '')
			.replace(/\-\-+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '')

		if (ignoreNums) {
			return str.replace(/\d/g, '')
		} else {
			return str
		}
	}

	static randomString(iter = 3) {
		const possible = 'abcdefghijklmnopqrstuvwxyz'

		let text = ''
		for (let i = 0; i < iter; i++) {
			text = text + possible.charAt(Math.floor(Math.random() * possible.length))
		}

		return text
	}

	static camelToSnake(text: string) {
		return text.replace(/([A-Z])/g, '_$1').toLowerCase()
	}

	static camelObjectToSnake(object) {
		const obj = {}

		for (const camel in object) {
			obj[this.camelToSnake(camel)] = object[camel]
		}

		return obj
	}

	static snakeToCamel(text: string) {
		return text.replace(/(_\w)/g, (match) => match[1].toUpperCase())
	}

	static snakeObjToCamel(obj) {
		if (Array.isArray(obj)) {
			return obj.map((item) => this.snakeObjToCamel(item))
		} else if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
			const newObj = {}

			for (const [key, value] of Object.entries(obj)) {
				const newKey = this.snakeToCamel(key)
				newObj[newKey] = this.snakeObjToCamel(value)
			}

			return newObj
		} else {
			return obj
		}
	}

	static parseObj(args, key, optionalKey?, optionalKey2?) {
		const obj = {}

		if (Array.isArray(args) && args.length > 0) {
			for (const item of args) {
				if (item.hasOwnProperty(key)) {
					obj[item[key]] = item
				} else if (optionalKey && item.hasOwnProperty(optionalKey)) {
					obj[item[optionalKey]] = item
				} else if (optionalKey2 && item.hasOwnProperty(optionalKey2)) {
					obj[item[optionalKey2]] = item
				}
			}
		}

		return obj
	}

	static cloneParseObj(args, key, optionalKey?, optionalKey2?) {
		const obj = {}

		if (Array.isArray(args) && args.length > 0) {
			for (const item of args) {
				if (item[key]) {
					obj[item[key]] = item
				} else if (optionalKey && item[optionalKey]) {
					obj[item[optionalKey]] = item
				} else if (optionalKey2 && item[optionalKey2]) {
					obj[item[optionalKey2]] = item
				}
			}
		}

		return obj
	}

	static parseArrayToObj(args, key, optional?) {
		const obj = {}

		if (Array.isArray(args) && args.length > 0) {
			for (const item of args) {
				if (key) {
					if (typeof key === 'string' && item[key]) {
						if (!obj[item[key]]) {
							obj[item[key]] = [item]
						} else {
							obj[item[key]].push(item)
						}
					} else if (typeof key === 'object') {
						if (!obj[item[key[0]][key[1]]]) {
							obj[item[key[0]][key[1]]] = [item]
						} else {
							obj[item[key[0]][key[1]]].push(item)
						}
					}
				} else if (optional) {
					if (typeof optional === 'string' && item[optional]) {
						if (!obj[item[optional]]) {
							obj[item[optional]] = [item]
						} else {
							obj[item[optional]].push(item)
						}
					} else if (typeof optional === 'object') {
						if (!obj[item[optional[0]][optional[1]]]) {
							obj[item[optional[0]][optional[1]]] = [item]
						} else {
							obj[item[optional[0]][optional[1]]].push(item)
						}
					}
				}
			}
		}

		return obj
	}

	static generateOTP(length: number = 6) {
		const digits = '0123456789'
		let otp = ''

		for (let i = 0; i < length; i++) {
			otp += digits[Math.floor(Math.random() * 10)]
		}

		return otp
	}

	static parseJSONObject(object) {
		return JSON.stringify(object).replace(/\\/g, '')
	}

	static makeRounds(num, decimals) {
		const factor = Math.pow(10, decimals)

		return Math.round((num + Number.EPSILON) * factor) / factor
	}

	static roundMin(value: number, decimals = 3) {
		if (value === 0) return value
		const factor = Math.pow(10, decimals)
		return Math.round((value + Number.EPSILON) * factor) / factor
	}

	static generateToken(length: number = 20) {
		return crypto.randomBytes(length).toString('hex')
	}

	static keyInObject(object: any, key: string) {
		return object.hasOwnProperty(key)
	}

	static parseCurrency(price: number) {
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
	}

	static arraysCombination(arrays: string[][]) {
		const combinations = []

		function combine(prefix, remainingArrays) {
			if (remainingArrays.length === 0) {
				combinations.push(prefix)

				return
			}

			const [firstArray, ...restArrays] = remainingArrays
			for (const element of firstArray) {
				combine([...prefix, element], restArrays)
			}
		}

		combine([], arrays)

		const uniqueCombinations = combinations
			.map((item) => JSON.stringify(item))
			.filter((value, index, self) => self.indexOf(value) === index)
			.map((item) => JSON.parse(item))

		return uniqueCombinations
	}

	static getCurrent() {
		return moment().tz('Asia/Bangkok').format(DATE_FORMAT)
	}

	static convertSortAlibaba(sort: string) {
		return `{${sort
			.split('_')
			.map((s) => `'${s}'`)
			.join(':')}}`
	}

	static removeVietnameseDiacritics(str) {
		return str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D')
	}

	static isNumeric(str) {
		return /^\d+$/.test(str)
	}

	static parseJson(target) {
		if (target) {
			if (typeof target === 'string') {
				return JSON.parse(target)
			}

			return target
		}

		return {}
	}

	static recursiveParseJson(target) {
		if (typeof target !== 'string') {
			return target
		}

		return this.recursiveParseJson(JSON.parse(target))
	}

	static convertBitToBool(bit: Buffer) {
		return Boolean(Buffer.from(bit).readUint8(0))
	}
}
