import { CustomLogger } from '@loggers/custom.logger'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
@Injectable()
export class CommonHelper {
	private readonly logger: CustomLogger = new CustomLogger()

	constructor() {
		this.logger.setContext(CommonHelper.name)
	}

	async writeFileJson(fileData: any, fileName: string) {
		const PREFIX = `WRITE_FILE_JSON_${fileName}`
		const folderPath = path.join(__dirname, '..', '..', 'jsons')
		const filePath = path.join(folderPath, `${fileName}.json`)
		const jsonData = JSON.stringify(fileData, null, 2)

		try {
			if (!fs.existsSync(folderPath)) {
				fs.mkdirSync(folderPath, { recursive: true })
			}

			fs.writeFileSync(filePath, jsonData, 'utf-8')

			this.logger.log(`${PREFIX}: Write data to file ${fileName}.json`)
		} catch (e) {
			throw e
		}
	}
}
