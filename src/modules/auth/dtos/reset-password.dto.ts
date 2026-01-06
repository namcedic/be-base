import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, Validate } from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'
import { MatchesProperty } from '@modules/auth/dtos/register.dto'

export class ResetPasswordDto {
	@ApiProperty()
	@IsString({ message: ERROR_CODE.INVALID_TOKEN })
	readonly token: string

	@ApiProperty()
	@IsString()
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
		message: ERROR_CODE.PASSWORD_FORMAT_INVALID
	})
	readonly password: string

	@ApiProperty()
	@IsString()
	@Validate(MatchesProperty, ['password'], { message: ERROR_CODE.RE_PASSWORD_NOT_MATCH })
	readonly confirmPassword: string
}
