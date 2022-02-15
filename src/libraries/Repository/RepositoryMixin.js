/**
* @typedef {import('objection').Model} Model
* @typedef {import('knex')} Knex
* @typedef {import('objection').QueryBuilder} QueryBuilder

*/

import {
    ModelNotFoundException
} from "./exceptions"
import Pagination from "./helpers/Pagination"

export default base => class extends base {
    async create(data) {
        const result = await this.query().insertAndFetch(data)
        return this.parseResult(result)
    }

    async update(data, id) {
        const result = await this.query().patchAndFetchById(id, data)
        return this.parseResult(result)
    }

    async delete(id) {
        return await this.query().deleteById(id)
    }

    async find(id) {
        let result
        if (this.relationship) result = await this.query().findById(id).withGraphFetched(this.relationship);
        else result = await this.query().findById(id)
        if (!result) throw new ModelNotFoundException(this.model.tableName, id);
        return this.parseResult(result)
    }

    async findByColumn(column, value) {
        let result = await this.query().where(column, value)
        if (result.length === 0) throw new ModelNotFoundException(this.model.tableName, value, column);
        if (this.relationship) result = result.withGraphFetched(this.relationship);
        return this.parseResult(result[0])
    }

    async all() {
        let results = await this.query()
        if (this.relationship) results = results.withGraphFetched(this.relationship);
        return this.parseResult(results)
    }

    async paginate(perPage = 10, page = 1) {
        let results
        if (this.relationship) {
            results = await this.query()
                .where(this.where)
                .orderBy(this.defaultOrdering())
                .withGraphFetched(this.relationship)
                .page(page - 1, perPage)
        } else {
            results = await this.query()
                .where(this.where)
                .orderBy(this.defaultOrdering())
                .page(page - 1, perPage)
        }
        return this.parseResult(new Pagination(results, perPage, page))
    }

}