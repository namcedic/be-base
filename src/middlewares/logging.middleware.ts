import { REQUEST_FROM } from '@constants/constant'
import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	private logger = new Logger(LoggingMiddleware.name)

	use(req: any, res: Response, next: NextFunction) {
		const { method, originalUrl, ip } = req
		const userAgent = req.get('user-agent') || ''

		this.logger.log(`[${method}] ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`)

		if (/ios|iphone|cfnetwork|darwin/i.test(userAgent)) {
			req.requestFrom = REQUEST_FROM.APP_IOS
		} else if (/android|okhttp|dalvik/i.test(userAgent)) {
			req.requestFrom = REQUEST_FROM.APP_ANDROID
		} else {
			req.requestFrom = REQUEST_FROM.WEB
		}

		next()
	}
}
