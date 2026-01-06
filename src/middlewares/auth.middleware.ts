import Response from '@commons/responses/response'
import { LOGGER_ACTIONS } from '@constants/actions'
import { SERVICE_PREFIX } from '@constants/constant'
import { RoutersApplyOptional, RoutersExclude, RoutersWithAlias } from '@constants/routers'
import { CustomLogger } from '@loggers/custom.logger'
import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Utils } from '@utils/utils'
import * as moment from 'moment'
import { EntityManager } from 'typeorm'
import { UserEntity } from '@databases/entities/user.entity'
import { JwtAuthService } from '@modules/auth/jwt-auth.service'
import { UserStatus } from '@app-types/user.type'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	private readonly logger: CustomLogger = new CustomLogger()

	constructor(
		private readonly jwtAuthService: JwtAuthService,
		private readonly manager: EntityManager
	) {
		this.logger.setContext(AuthMiddleware.name)
	}

	async use(request: any, response: any, next: (error?: Error | any) => void) {
		const PREFIX = 'AUTH_MIDDLEWARE'

		try {
			const authorization = request.headers.authorization
			const token = authorization && authorization.split(' ')[1]

			let path = request?.baseUrl?.replace(`/${SERVICE_PREFIX}`, '')

			const splitPath = path.split('/')
			if (splitPath?.[splitPath.length - 1] && Utils.isNumeric(splitPath[splitPath.length - 1])) {
				path = splitPath.splice(0, splitPath.length - 1)?.join('/')
			}

			for (const route of Object.keys(RoutersWithAlias)) {
				if (path.indexOf(route) !== -1) {
					path = `/${path.split('/')?.[1]}`

					break
				}
			}

			const method = request?.method
			const optionalAuthUrls = path ? RoutersApplyOptional[path] : []
			const excludeAuthUrls = path ? RoutersExclude[path] : []

			if (!(excludeAuthUrls && excludeAuthUrls.includes(method))) {
				if (optionalAuthUrls && optionalAuthUrls.includes(method)) {
					if (token) {
						request.user = await this.verifyToken(token)
					}
					next()
				} else {
					if (token) {
						request.user = await this.verifyToken(token)
						next()
					} else {
						throw new UnauthorizedException('Unauthorized')
					}
				}
			} else {
				next()
			}
		} catch (e) {
			this.logger.error(`${PREFIX}: ${e.message} - Action: ${LOGGER_ACTIONS.CATCH_FUNCTION} - Stack: ${e.stack}`)

			return response.status(HttpStatus.UNAUTHORIZED).send(new Response(HttpStatus.UNAUTHORIZED, null, false, 'Unauthorized'))
		}
	}

	private async verifyToken(token: string) {
		try {
			const auth = this.jwtAuthService.verify(token)
			const { username, email, phone } = auth

			const before = moment()
			const customer = await this.manager
				.getRepository(UserEntity)
				.createQueryBuilder('user')
				.select('user.*')
				.where('user.phone = :phone', { phone })
				.orWhere('user.email = :email', { email })
				.orWhere('user.username = :username', { username })
				.andWhere('user.status = :status', { status: UserStatus.ACTIVE })
				.getRawOne()

			const after = moment()
			const duration = moment.duration(after.diff(before))
			this.logger.log(`Request to verify token took: ${duration.asMilliseconds()} ms`)

			if (!customer) {
				throw new UnauthorizedException('Token invalid')
			}

			return customer
		} catch (e) {
			throw e
		}
	}
}
