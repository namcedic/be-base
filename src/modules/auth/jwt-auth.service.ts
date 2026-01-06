import { TOKEN_TYPE } from '@constants/constant'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { ConfigService } from '@nestjs/config'
import { AllConfigType } from '@configs/config.type'

@Injectable()
export class JwtAuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	hash(value: string) {
		const saltRounds = 12
		const salt = bcrypt.genSaltSync(saltRounds)
		const plain = value + this.configService.get<AllConfigType>('auth.jwtPepper')

		return bcrypt.hashSync(plain, salt)
	}

	compare(plain, encrypted) {
		return bcrypt.compareSync(plain + this.configService.get<AllConfigType>('auth.jwtPepper'), encrypted)
	}

	verify(token: string, tokenType: string = TOKEN_TYPE.ACCESS.TEXT) {
		if (tokenType === TOKEN_TYPE.ACCESS.TEXT) {
			return this.jwtService.verify(token, {
				secret: this.configService.get<string>('auth.secretAccess')
			})
		} else if (tokenType === TOKEN_TYPE.RESET.TEXT) {
			return this.jwtService.verify(token, {
				secret: this.configService.get<string>('auth.secretReset')
			})
		}

		return this.jwtService.verify(token, {
			secret: this.configService.get<string>('auth.secretRefresh')
		})
	}

	generateToken(params, tokenType): string {
		let secret
		let expiresIn

		switch (tokenType) {
			case TOKEN_TYPE.REFRESH.TEXT:
				secret = this.configService.get<string>('auth.secretRefresh')
				expiresIn = TOKEN_TYPE.REFRESH.EXPIRES + 'd'

				break
			case TOKEN_TYPE.ACCESS.TEXT:
				secret = this.configService.get<string>('auth.secretAccess')
				expiresIn = TOKEN_TYPE.ACCESS.EXPIRES + 'm'

				break
			case TOKEN_TYPE.RESET.TEXT:
				secret = this.configService.get<string>('auth.secretReset')
				expiresIn = TOKEN_TYPE.RESET.EXPIRES + 'm'

				break
			default:
				return
		}

		return this.jwtService.sign(params, { secret, expiresIn })
	}
}
