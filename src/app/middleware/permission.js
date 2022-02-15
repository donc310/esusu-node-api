/**
* @typedef {import('express').Response} Response
* @typedef {import('express').Request} Request
* @typedef {import('express').NextFunction} Next
* @typedef {import('accesscontrol').AccessControl} Ac
*/

/**
 * Grant Access to an action on a resource
 * 
 * @param {Ac} ac 
 * @param {string} action 
 * @param {String} resource 
 * @returns 
 */
export default function grantAccess(ac, action, resource) {
    /**
    * @param {Request} req 
    * @param {Response} res 
    * @param {Next} next 
    */
    return async (req, res, next) => {
        try {
            const permission = ac.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

/**
 ** Grant Access to an action on a resource 
 * if the user has either an 'Own' or 'Any' permission on the resource
 
 * @param {Ac} ac 
 * @param {string} action 
 * @param {String} resource 
 * @returns 
 */
 export  function checkOwnership(ac, action, resource) {
    /**
    * @param {Request} req 
    * @param {Response} res 
    * @param {Next} next 
    */
    return async (req, res, next) => {
        try {
            const actions = [
                `${action}Own`,
                `${action}Any`
            ]
            const permission = (req.user.id === req.params.userId)
                ? ac.can(req.user.role)[actions[0]](resource)
                : ac.can(req.user.role)[actions[1]](resource)

            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}