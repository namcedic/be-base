import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'

export class ChangePasswordFromCMSDto {
	@ApiProperty()
	@IsNotEmpty()
	readonly cid: number

	@ApiProperty()
	@IsString({ message: ERROR_CODE.PASSWORD_REQUIRED })
	@IsDefined()
	@MinLength(8, { message: 'Password tối thiểu 8 kí tự' })
	readonly newPassword: string
}
