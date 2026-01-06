import { Moment } from 'moment'

export interface iAuth {
	accessToken: string
	accessExpiresIn: Moment
	refreshToken: string
	refreshExpiresIn: Moment
	user?: IUser
	session?: any
}

interface IUser {
	cid: number
	email: string
	phone: string
}
