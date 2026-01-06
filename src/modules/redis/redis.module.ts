import { Module } from '@nestjs/common'
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisService } from '@modules/redis/redis.service'

@Module({
	imports: [
		NestRedisModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				const redisConfig = configService.get('redis')
				return {
					type: 'single',
					host: redisConfig.host,
					port: redisConfig.port,
					password: redisConfig.password
				}
			},
			inject: [ConfigService]
		})
	],
	providers: [RedisService],
	exports: [RedisService]
})
export class RedisModule {}
