import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'

export class ForgotPasswordDto {
	@ApiProperty()
	@IsEmail({}, { message: ERROR_CODE.INVALID_EMAIL })
	@IsString()
	readonly email?: string
}
