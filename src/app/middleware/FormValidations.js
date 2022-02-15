import { ValidationException } from "../exceptions"
import { validationResult }    from "express-validator"

export default (req, res, next) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => msg

    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        throw new ValidationException(errors.mapped())
    }

    next()
}
