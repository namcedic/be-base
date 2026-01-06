import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'

export class LoginRequestDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString({ message: ERROR_CODE.INVALID_USERNAME })
	username?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsEmail({}, { message: ERROR_CODE.INVALID_EMAIL })
	email?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString({ message: ERROR_CODE.PHONE_REQUIRED })
	phone?: string

	@ApiProperty()
	@IsString({ message: ERROR_CODE.PASSWORD_REQUIRED })
	@IsNotEmpty({ message: ERROR_CODE.PASSWORD_REQUIRED })
	password: string
}
