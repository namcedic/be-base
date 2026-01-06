import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString, Matches, Validate } from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'
import { MatchesProperty } from '@modules/auth/dtos/register.dto'

export class ChangePasswordDto {
	@ApiProperty()
	@IsString({ message: ERROR_CODE.PASSWORD_REQUIRED })
	@IsDefined()
	readonly oldPassword: string

	@ApiProperty()
	@IsString({ message: ERROR_CODE.PASSWORD_REQUIRED })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
		message: ERROR_CODE.PASSWORD_FORMAT_INVALID
	})
	readonly newPassword: string

	@ApiProperty()
	@IsString()
	@Validate(MatchesProperty, ['newPassword'], { message: ERROR_CODE.RE_PASSWORD_NOT_MATCH })
	readonly confirmNewPassword: string
}
