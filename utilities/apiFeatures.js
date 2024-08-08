/* eslint-disable node/no-unsupported-features/es-syntax */
class ApiFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		//1) Filtering simple queries
		const queryObj = { ...this.queryString };
		const excludedFields = [
			'page',
			'limit',
			'fields',
			'skip',
			'sort',
			'keyword',
		];
		excludedFields.forEach((field) => delete queryObj[field]);

		//2) Filtering Advanced queries
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt|eq|ne|in|nin)\b/g,
			(match) => `$${match}`,
		);
		this.query = this.query.find(JSON.parse(queryStr));
		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.replaceAll(',', ' ');
			// const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt'); // default sort by createdAt in descending order if no sort parameter is provided.
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.replaceAll(',', ' ');
			// const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}

	search() {
		if (this.queryString.keyword) {
			const { keyword } = this.queryString;

			if (this.query.mongooseCollection.modelName === 'Product') {
				this.query = this.query.find({
					$or: [
						{ title: { $regex: keyword, $options: 'i' } },
						{ description: { $regex: keyword, $options: 'i' } },
					],
				});
			} else {
				this.query = this.query.find({
					$or: [
						{ name: { $regex: keyword, $options: 'i' } },
						{ slug: { $regex: keyword, $options: 'i' } },
					],
				});
			}
		}
		return this;
	}

	paginate(documentsCount) {
		const page = +this.queryString.page || 1;
		const limit = +this.queryString.limit || 15;
		const skip = (page - 1) * limit;

		//Pagination Result
		const pagination = {};
		pagination.page = page;
		pagination.limit = limit;
		pagination.numOfPages = Math.ceil(documentsCount / limit);

		//Page 1 & there're other pages
		if (page === 1 && pagination.numOfPages > 1) {
			pagination.nextPage = page + 1;
		}
		if (page === pagination.numOfPages) {
			pagination.prevPage = page - 1;
		}
		if (page > 1 && page < pagination.numOfPages) {
			pagination.nextPage = page + 1;
			pagination.prevPage = page - 1;
		}

		this.query = this.query.skip(skip).limit(limit);
		this.paginationResult = pagination;

		return this;
	}
}

module.exports = ApiFeatures;
