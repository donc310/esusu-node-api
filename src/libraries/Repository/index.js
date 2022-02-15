import BaseTransformer from "./transformer"
import Pagination from "./helpers/Pagination"
import RepositoryMixin from "./RepositoryMixin"
import { isArray } from "../../helpers/core.helper"

/**
 * @typedef {import("objection").Model} Model
 */
/**
* @typedef {import('knex').Knex} Knex
* @typedef {import('objection').QueryBuilder} QueryBuilder
*/

@RepositoryMixin
export default class BaseRepository {

    constructor() {
        this._init()
    }

    _init() {
        if (this.model === undefined) {
            throw new TypeError("Repository should have 'model' method defined.")
        }

        this.model = this.model()
        this.transformer = null
        this.transformerSkipped = false
        this.relationShip = null
        this.where = {}
    }
    /**
     * 
     * @param {*} transformer 
     * @returns 
     */

    setTransformer(transformer) {
        this.transformer = transformer
        return this
    }

    setRelated(relationship) {
        this.relationship = relationship
        return this
    }
    setWhere(query) {
        this.where = query
        return this
    }

    skipTransformer(skip = true) {
        this.transformerSkipped = skip
    }

    parseResult(data) {
        if (this.transformerSkipped || !(this.transformer instanceof BaseTransformer)) {
            return data instanceof Pagination ? data.get() : data
        }

        if (data instanceof Pagination) {
            const paginatedResults = data.get()
            const results = paginatedResults.data.map(datum => this.transformer.transform(datum))
            return { paginatedData: results, meta: { pagination: paginatedResults.pagination } }
        }

        return isArray(data) ? data.map(datum => this.transformer.transform(datum)) : this.transformer.transform(data)
    }
    /**
     * 
     * @returns {QueryBuilder}
     */
    query() {
        return this.model.query()
    }
    /**
     * 
     * @returns {Knex}
     */
    knex() {
        return this.model.knex()
    }
    /**
     * 
     * @returns {String}
     */
    defaultOrdering() {
        return this.model.defaultSortBy
    }

}
