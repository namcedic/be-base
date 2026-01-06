import { Injectable } from '@nestjs/common'
import { CustomLogger } from '@helpers/custom.logger'

enum CronExpression {
	EVERY_5_SECONDS = '*/5 * * * * *',
	EVERY_10_SECONDS = '*/10 * * * * *',
	EVERY_30_SECONDS = '*/30 * * * * *',
	EVERY_1_MINUTES = '0 */1 * * * *',
	EVERY_2_MINUTES = '0 */2 * * * *',
	EVERY_5_MINUTES = '0 */5 * * * *',
	EVERY_30_MINUTES = '0 */30 * * * *',
	EVERY_60_MINUTES = '0 * * * *',
	EVERY_DAY_AT_MIDNIGHT = '0 0 * * *',
	EVERY_DAY_AT_ONE_AM = '0 1 * * *',
	EVERY_DAY_AT_TWO_AM = '0 2 * * *',
	EVERY_WEEK_AT_THREE_AM = '0 3 * * 0',
	EVERY_DAY_AT_12PM_AND_MIDNIGHT = '0 0,12 * * *',
	EVERY_SUNDAY_AT_4AM = '0 4 * * 0'
}

@Injectable()
export class CronService {
	private readonly logger: CustomLogger = new CustomLogger()

	constructor() {
		this.logger.setContext(CronService.name)
	}

	async log() {
		this.logger.debug('CronService')
		this.logger.log(CronExpression.EVERY_30_MINUTES)
	}
}
