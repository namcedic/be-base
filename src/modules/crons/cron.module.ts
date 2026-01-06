import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as https from 'https'
import { RedisModule } from '@modules/redis/redis.module'
import { CronService } from '@modules/crons/cron.service'

@Module({
	imports: [
		HttpModule.register({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false
			})
		}),

		RedisModule,
		ScheduleModule.forRoot(),
		TypeOrmModule.forFeature([])
	],
	providers: [],
	exports: [CronService]
})
export class CronModule {}
