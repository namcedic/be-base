export interface IChangePassword {
	readonly oldPassword: string
	readonly newPassword: string
	readonly confirmNewPassword: string
}
