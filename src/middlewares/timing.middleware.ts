import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class TimingMiddleware implements NestMiddleware {
	private readonly logger: Logger = new Logger(TimingMiddleware.name)

	use(req: Request, res: Response, next: NextFunction) {
		const startTime = process.hrtime()

		try {
			res.on('finish', () => {
				const elapsed = process.hrtime(startTime)
				const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1e6
				const moduleName = req?.route?.path // Customize this to log the desired module name

				if (moduleName) {
					this.logger.log(`[${moduleName}] Execution time: \x1b[33m${`+${elapsedMs.toFixed(0)}ms`}\x1b[0m`)
				}
			})

			next()
		} catch (error) {
			return res.status(HttpStatus.BAD_REQUEST).json({ message: error?.message })
		}
	}
}
