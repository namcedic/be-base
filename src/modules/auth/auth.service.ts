import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { TOKEN_TYPE } from '@constants/constant'
import { ERROR_CODE } from '@constants/error-code'
import * as moment from 'moment'
import { LOGGER_ACTIONS } from '@constants/actions'
import { CustomLogger } from '@loggers/custom.logger'
import { UserRepository } from '@databases/repositories/user.repository'
import { JwtAuthService } from '@modules/auth/jwt-auth.service'
import { normalizeEmail, normalizePhone, normalizeUsername, trimText } from '@utils/common'
import { UserStatus } from '@app-types/user.type'
import { Utils } from '@utils/utils'
import { IRegisterRequest } from '@commons/interfaces/request/auth/register.interface'
import { RedisService } from '@modules/redis/redis.service'

@Injectable()
export class AuthService {
	private readonly logger: CustomLogger = new CustomLogger()
	constructor(
		private readonly userRepository: UserRepository,
		private readonly jwtAuthService: JwtAuthService,
		private readonly redisService: RedisService
	) {
		this.logger.setContext(AuthService.name)
	}

	async register(payload: IRegisterRequest) {
		const PREFIX = `REGISTER_${payload?.username || payload?.email || payload?.phone}`
		const lockKey = `lock:register:${payload.email || payload.phone}`
		const lockValue = PREFIX
		const lockTTL = 30

		try {
			const acquired = await this.redisService.set(lockKey, lockValue, lockTTL, true)
			if (!acquired) {
				throw new BadRequestException({
					message: 'SOMETHING_WENT_WRONG',
					data: null,
					statusCode: ERROR_CODE.SOMETHING_WENT_WRONG
				})
			}
			const username = normalizeUsername(payload.username)
			const email = normalizeEmail(payload.email)
			const phone = normalizePhone(payload.phone)

			if (!username) {
				throw new BadRequestException({
					message: 'USERNAME_REQUIRED',
					data: null,
					statusCode: ERROR_CODE.SOMETHING_WENT_WRONG
				})
			}

			if (!payload?.password) {
				throw new BadRequestException({
					message: 'PASSWORD_REQUIRED',
					data: null,
					statusCode: ERROR_CODE.INVALID_USERNAME_EMAIL_OR_PASSWORD
				})
			}

			const [existedUsername, existedEmail, existedPhone] = await Promise.all([
				this.userRepository.findUserByUsername(username),
				email ? this.userRepository.findUserByEmail(email) : Promise.resolve(null),
				phone ? this.userRepository.findUserByPhone(phone) : Promise.resolve(null)
			])

			if (existedUsername) {
				throw new BadRequestException({
					message: 'USERNAME_ALREADY_EXISTS',
					data: null,
					statusCode: ERROR_CODE.PHONE_OR_EMAIL_ALREADY_EXISTS
				})
			}

			if (existedEmail) {
				throw new BadRequestException({
					message: 'EMAIL_ALREADY_EXISTS',
					data: null,
					statusCode: ERROR_CODE.PHONE_OR_EMAIL_ALREADY_EXISTS
				})
			}

			if (existedPhone) {
				throw new BadRequestException({
					message: 'PHONE_ALREADY_EXISTS',
					data: null,
					statusCode: ERROR_CODE.PHONE_OR_EMAIL_ALREADY_EXISTS
				})
			}

			const hashPassword = this.jwtAuthService.hash(payload.password)
			const user = this.userRepository.create({
				username,
				email,
				phone,
				password: hashPassword,
				status: UserStatus.ACTIVE,
				firstName: trimText(payload.firstName),
				lastName: trimText(payload.lastName)
			})

			const saved = await this.userRepository.save(user)

			const signParams: any = { user: saved.id, username: saved.username }
			if (saved.email) signParams.email = saved.email
			if (saved.phone) signParams.phone = saved.phone

			this.logger.log(`${PREFIX}: Process register - Action: ${LOGGER_ACTIONS.REGISTER}`)

			const accessToken = this.jwtAuthService.generateToken(signParams, TOKEN_TYPE.ACCESS.TEXT)
			const accessExpiresIn = moment().add(TOKEN_TYPE.ACCESS.EXPIRES, 'm')
			const refreshToken = this.jwtAuthService.generateToken(signParams, TOKEN_TYPE.REFRESH.TEXT)
			const refreshExpiresIn = moment().add(TOKEN_TYPE.REFRESH.EXPIRES, 'days')

			return { accessToken, accessExpiresIn, refreshToken, refreshExpiresIn }
		} catch (e) {
			this.logger.error(`${PREFIX}: ${e.message} - Action: ${LOGGER_ACTIONS.CATCH_FUNCTION} - Stack: ${e.stack}`)
			throw e
		} finally {
			const currentValue = await this.redisService.get(lockKey)
			if (currentValue === lockValue) {
				await this.redisService.del(lockKey)
			}
		}
	}

	async login(payload: { username?: string; email?: string; phone?: string; password: string }) {
		const PREFIX = `LOGIN_${payload?.username || payload?.email || payload?.phone}`

		try {
			const username = normalizeUsername(payload.username)
			const email = normalizeEmail(payload.email)
			const phone = normalizePhone(payload.phone)

			if (!payload?.password) {
				throw new BadRequestException({
					message: 'PASSWORD_REQUIRED',
					data: null,
					statusCode: ERROR_CODE.INVALID_USERNAME_EMAIL_OR_PASSWORD
				})
			}

			if (!username && !email && !phone) {
				throw new BadRequestException({
					message: 'USERNAME_OR_EMAIL_OR_PHONE_REQUIRED',
					data: null,
					statusCode: ERROR_CODE.EMAIL_OR_PHONE_REQUIRED
				})
			}

			const [userByUsername, userByEmail, userByPhone] = await Promise.all([
				username ? this.userRepository.findUserByUsername(username) : Promise.resolve(null),
				email ? this.userRepository.findUserByEmail(email) : Promise.resolve(null),
				phone ? this.userRepository.findUserByPhone(phone) : Promise.resolve(null)
			])

			const user = userByUsername || userByEmail || userByPhone

			if (!user || !user.password) {
				throw new BadRequestException({
					message: 'INVALID_USERNAME_EMAIL_OR_PASSWORD',
					data: null,
					statusCode: ERROR_CODE.INVALID_USERNAME_EMAIL_OR_PASSWORD
				})
			}

			const ok = this.jwtAuthService.compare(payload.password, user.password)
			if (!ok) {
				throw new BadRequestException({
					message: 'INVALID_USERNAME_EMAIL_OR_PASSWORD',
					data: null,
					statusCode: ERROR_CODE.INVALID_USERNAME_EMAIL_OR_PASSWORD
				})
			}

			const signParams: any = { user: user.id, username: user.username }
			if (user.email) signParams.email = user.email
			if (user.phone) signParams.phone = user.phone

			this.logger.log(`${PREFIX}: Process login - Action: ${LOGGER_ACTIONS.GEN_TOKEN}`)

			const accessToken = this.jwtAuthService.generateToken(signParams, TOKEN_TYPE.ACCESS.TEXT)
			const accessExpiresIn = moment().add(TOKEN_TYPE.ACCESS.EXPIRES, 'm')
			const refreshToken = this.jwtAuthService.generateToken(signParams, TOKEN_TYPE.REFRESH.TEXT)
			const refreshExpiresIn = moment().add(TOKEN_TYPE.REFRESH.EXPIRES, 'days')

			this.userRepository.update(user.id, { lastLogin: Utils.getCurrent() })
			return { accessToken, accessExpiresIn, refreshToken, refreshExpiresIn }
		} catch (e) {
			this.logger.error(`${PREFIX}: ${e.message} - Action: ${LOGGER_ACTIONS.CATCH_FUNCTION} - Stack: ${e.stack}`)
			throw e
		}
	}

	async logout(user: { id: number }) {
		console.log(user)
		return true
	}

	async refreshAccessToken(payload: { refreshToken: string }) {
		const PREFIX = `REFRESH_TOKEN`

		try {
			const refresh = payload.refreshToken
			const verify = this.jwtAuthService.verify(refresh, TOKEN_TYPE.REFRESH.TEXT)

			const userId = Number(verify?.user)
			if (!userId) {
				throw new UnauthorizedException({
					message: 'INVALID_TOKEN',
					data: null,
					statusCode: ERROR_CODE.INVALID_TOKEN
				})
			}

			const user = await this.userRepository.findOneBy({ id: userId })
			if (!user) {
				throw new UnauthorizedException({
					message: 'INVALID_TOKEN',
					data: null,
					statusCode: ERROR_CODE.INVALID_TOKEN
				})
			}

			const signParams: any = { user: user.id, username: user.username }
			if (user.email) signParams.email = user.email
			if (user.phone) signParams.phone = user.phone

			const accessToken = this.jwtAuthService.generateToken(signParams, TOKEN_TYPE.ACCESS.TEXT)
			const refreshToken = this.jwtAuthService.generateToken(signParams, TOKEN_TYPE.REFRESH.TEXT)
			const accessExpiresIn = moment().add(TOKEN_TYPE.ACCESS.EXPIRES, 'm')
			const refreshExpiresIn = moment().add(TOKEN_TYPE.REFRESH.EXPIRES, 'days')

			return { accessToken, accessExpiresIn, refreshToken, refreshExpiresIn }
		} catch (e) {
			this.logger.error(`${PREFIX}: ${e.message} - Action: ${LOGGER_ACTIONS.CATCH_FUNCTION} - Stack: ${e.stack}`)
			throw e
		}
	}

	async changePassword(payload: { oldPassword: string; newPassword: string }, user: { id: number }) {
		const PREFIX = `CHANGE_PASSWORD_${user?.id}`

		try {
			const found = await this.userRepository.findOneBy({ id: user.id })
			if (!found || !found.password) {
				throw new BadRequestException({
					message: 'USER_NOT_FOUND',
					data: null,
					statusCode: ERROR_CODE.USER_NOT_FOUND
				})
			}

			if (payload.oldPassword === payload.newPassword) {
				throw new BadRequestException({
					message: 'SAME_PASSWORD_ERROR',
					data: null,
					statusCode: ERROR_CODE.SAME_PASSWORD_ERROR
				})
			}

			const ok = this.jwtAuthService.compare(payload.oldPassword, found.password)
			if (!ok) {
				throw new BadRequestException({
					message: 'OLD_PASSWORD_NOT_MATCH',
					data: null,
					statusCode: ERROR_CODE.OLD_PASSWORD_NOT_MATCH
				})
			}

			const hash = this.jwtAuthService.hash(payload.newPassword)

			// ✅ updatePassword của repo
			await this.userRepository.updatePassword(found.id, hash)

			return true
		} catch (e) {
			this.logger.error(`${PREFIX}: ${e.message} - Action: ${LOGGER_ACTIONS.CATCH_FUNCTION} - Stack: ${e.stack}`)
			throw e
		}
	}

	async getSessionUser(userId: number) {
		const PREFIX = `GET_USER_SESSION_${userId}`

		try {
			const user = await this.userRepository.getSessionUser(userId)

			if (!user) {
				throw new UnauthorizedException({
					message: 'USER_NOT_FOUND',
					data: null,
					statusCode: ERROR_CODE.USER_NOT_FOUND
				})
			}

			return {
				success: true,
				data: user,
				message: 'Get user session successfully'
			}
		} catch (e) {
			this.logger.error(`${PREFIX}: ${e.message} - Action: ${LOGGER_ACTIONS.CATCH_FUNCTION} - Stack: ${e.stack}`)
			throw e
		}
	}
}
