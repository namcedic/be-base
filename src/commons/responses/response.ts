import { ApiProperty } from '@nestjs/swagger'

class Response {
	@ApiProperty()
	public code: number

	@ApiProperty()
	public message: string

	@ApiProperty()
	public status: boolean

	@ApiProperty()
	public data: any

	constructor(code: number, data: any, status: boolean, message: string = '') {
		this.code = code
		this.status = status
		this.message = message ? message : 'Success'
		this.data = data
	}
}

export default Response
