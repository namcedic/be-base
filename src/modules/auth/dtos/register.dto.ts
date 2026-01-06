import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'
import { ERROR_CODE } from '@constants/error-code'

@ValidatorConstraint({ name: 'matchesProperty', async: false })
export class MatchesProperty implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		const [relatedPropertyName] = args.constraints
		const relatedValue = (args.object as any)[relatedPropertyName]

		return value === relatedValue
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	defaultMessage(args: ValidationArguments) {
		return `Mật khẩu xác nhận không chính xác`
	}
}

export class RegisterRequestDto {
	@ApiProperty()
	@IsOptional()
	@IsNotEmpty({ message: ERROR_CODE.EMAIL_REQUIRED })
	@IsString({ message: ERROR_CODE.EMAIL_REQUIRED })
	@IsEmail({}, { message: ERROR_CODE.INVALID_EMAIL })
	email: string

	@ApiProperty()
	@IsNotEmpty({ message: ERROR_CODE.EMAIL_REQUIRED })
	@IsString({ message: ERROR_CODE.EMAIL_REQUIRED })
	username: string

	@ApiProperty()
	@IsOptional()
	@IsNotEmpty({ message: ERROR_CODE.PHONE_REQUIRED })
	@IsString({ message: ERROR_CODE.PHONE_REQUIRED })
	phone: string

	@ApiProperty()
	@IsNotEmpty({ message: ERROR_CODE.PASSWORD_REQUIRED })
	@IsString({ message: ERROR_CODE.PASSWORD_REQUIRED })
	@MinLength(8, { message: ERROR_CODE.PASSWORD_FORMAT_INVALID })
	password: string

	@ApiProperty()
	@IsNotEmpty({ message: ERROR_CODE.RE_PASSWORD_NOT_MATCH })
	@IsString({ message: ERROR_CODE.RE_PASSWORD_NOT_MATCH })
	@Validate(MatchesProperty, ['password'], { message: ERROR_CODE.RE_PASSWORD_NOT_MATCH })
	rePassword: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly fullName?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly otp?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString({ message: ERROR_CODE.UTM_SOURCE_REQUIRED })
	readonly utmSource?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utmMedium?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utmCampaign?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utmContent?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	readonly utmTerm?: string
}
