import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { CookieOptions, Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { COOKIE_OPTIONS } from '@constants/constant'

@Injectable()
export class CookiesInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const ctx = context.switchToHttp()
		const response = ctx.getResponse<Response>()

		return next.handle().pipe(
			map((data) => {
				const session = data?.data?.session

				const message = session && session?.message
				const aes = session && session?.aes

				if (message) {
					response.cookie('session', message, COOKIE_OPTIONS as CookieOptions)
				}

				if (aes) {
					response.cookie('key', aes, COOKIE_OPTIONS as CookieOptions)
				}

				delete data?.data?.session

				return data
			})
		)
	}
}
