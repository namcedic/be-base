import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString } from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'

export class RefreshRequestDto {
	@ApiProperty()
	@IsString({ message: ERROR_CODE.INVALID_TOKEN })
	@IsDefined()
	refreshToken: string
}
