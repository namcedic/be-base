import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class RedisService {
	constructor(@InjectRedis() private readonly redis: Redis) {}

	async set(key: string, value: string | object | number, durationInSeconds: number, isNX?: boolean) {
		if (typeof value === 'object') {
			value = JSON.stringify(value)
		}

		if (isNX) {
			return this.redis.set(key, value, 'EX', durationInSeconds, 'NX')
		} else {
			return this.redis.set(key, value, 'EX', durationInSeconds)
		}
	}

	setWithoutExpireTime(key: string, value: string | object | number) {
		if (typeof value === 'object') {
			value = JSON.stringify(value)
		}

		return this.redis.set(key, value)
	}

	async get(key: string) {
		const value = await this.redis.get(key)
		try {
			if (!value) {
				return undefined
			}
			const parsedValue = JSON.parse(value)
			return parsedValue
		} catch (e) {
			return value
		}
	}

	async getKeysByPrefix(pattern: string): Promise<string[]> {
		return this.redis.keys(`${pattern}:*`)
	}

	async getKeys(key: string): Promise<string[]> {
		return this.redis.keys(key)
	}

	async mget(keys: string[]): Promise<string[]> {
		return this.redis.mget(keys)
	}

	async exists(key: string): Promise<boolean> {
		const result = await this.redis.exists(key)
		return result === 1
	}

	async del(key: string) {
		return this.redis.del(key)
	}

	async delKeys(...keys: string[]) {
		return this.redis.del(keys)
	}

	async delIfExists(key: string) {
		const exists = await this.exists(key)
		if (exists) {
			await this.del(key)
		}
	}

	/**
	 * Increment giá trị của key (atomic operation)
	 * Nếu key chưa tồn tại, sẽ được khởi tạo với giá trị 0 rồi mới increment
	 * @param key - Redis key
	 * @returns Giá trị sau khi increment
	 */
	async incr(key: string): Promise<number> {
		return this.redis.incr(key)
	}

	/**
	 * Increment giá trị của key với số lượng tùy chỉnh (atomic operation)
	 * @param key - Redis key
	 * @param increment - Số lượng cần tăng
	 * @returns Giá trị sau khi increment
	 */
	async incrBy(key: string, increment: number): Promise<number> {
		return this.redis.incrby(key, increment)
	}

	/**
	 * Set expire time cho key
	 * @param key - Redis key
	 * @param seconds - Số giây expire
	 * @returns 1 nếu thành công, 0 nếu key không tồn tại
	 */
	async expire(key: string, seconds: number): Promise<number> {
		return this.redis.expire(key, seconds)
	}

	/**
	 * Get TTL (time to live) của key
	 * @param key - Redis key
	 * @returns Số giây còn lại, -1 nếu key không có expire, -2 nếu key không tồn tại
	 */
	async ttl(key: string): Promise<number> {
		return this.redis.ttl(key)
	}
}
