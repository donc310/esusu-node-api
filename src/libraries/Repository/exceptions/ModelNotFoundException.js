export default class ModelNotFoundException extends Error {
    constructor(modelName, value, column = "id") {
        super()
        this.modelName = modelName
        this.column = column
        this.value = value
        this.message = `No record found for ${this.modelName} with ${this.column}: ${this.value}`
    }
}
