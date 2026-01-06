class Pagination {
	public page: number

	public size: number

	public totalPage: number

	public total: number

	constructor(page: number, size: number, total: number, totalPage: number = 0) {
		this.page = page * 1
		this.size = size * 1
		this.totalPage = totalPage ? totalPage : total % size === 0 ? total / size : Math.ceil(total / size)
		this.total = total
	}
}

export default Pagination
