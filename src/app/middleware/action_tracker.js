/**
* @typedef {import('express').Response} Response
* @typedef {import('express').Request} Request
* @typedef {import('express').NextFunction} Next
*/

/**
 * Adds the specified filed to a request post or get parameters
 * @param {String} action 
 * @returns 
 */
export function tracker(action) {
    /**
   * Auto populate the specified fields
   * @param {Request} req 
   * @param {Response} res 
   * @param {Next} next 
   */
    return async function (req, res, next) {
        if (['PUT', 'PATCH', 'POST'].indexOf(req.method) !== -1) {
            req.body[action] = req.user.id
        }
        else if (req.method === "GET") {

        }
        next()
    }
}