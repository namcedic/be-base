import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'

export class DeleteAccountDto {
	@ApiProperty()
	@IsString({ message: ERROR_CODE.PASSWORD_REQUIRED })
	readonly password: string
}
