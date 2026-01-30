import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				const redisConfig = configService.get('redis')
				return {
					connection: {
						host: redisConfig.host,
						port: redisConfig.port,
						password: redisConfig.password
					}
				}
			},
			inject: [ConfigService]
		})
	],
	exports: [BullModule]
})
export class QueueModule {}
