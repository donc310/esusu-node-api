import { NestedError } from "nested-error-stacks"

export class EnvironmentError {
    constructor(message, nested) {
        NestedError.call(this, message, nested)
    }
}
