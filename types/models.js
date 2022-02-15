/**
* @typedef {import('express').Response} Response
* @typedef {import('express').Request} Resquest
* @typedef {import('objection').Model} Model
*/

/**
 * @typedef {Object}
 */

/**
 * @typedef {Model} SubPlan
 * @property {Number} id
 * @property {Number} plan_id
 * @property {Number} price
 * @property {String} currency
 * @property {string} type
 * @property {string} name
 * @property {string} description
 *
 */

export default SubPlan

/**
* @typedef {Object} FullName
 * @property {String} first_name
 * @property {String} last_name

 */

/**
 * @typedef {Model} Customer
 * @property {Number} id
 * @property {String} email
 * @property {String} username
 * @property {FullName} full_name
 * @property {(String|undefined)} recurly_customer_id
 *
 */

export default Customer


/**
 * @typedef {Customer} User
 */

/**
* @typedef {Object}  CreateSubscriptionProductResponse
* @property {Number} sub_plan_id
* @property {String} channel
* @property {String} product_id
* @property {String} product_name
* @property {String} product_description
* @property {Object} meta_data
*
*/

export default CreateSubscriptionProductResponse


/**
 * A Tenant
 * @typedef {Object} Tenant
 * @property {Number} id - id
 * @property {Number} uuid - The uuid
 * @property {String} db_host
 * @property {String} db_port
 * @property {String} db_username - The DB Username
 * @property {String} db_password - The DB Password
 * @property {String} db_name - The DB Name
 * @property {String} state - Current state
 */

export default Tenant


/**
 * A ConnectionConfig
 * @typedef {Object} ConnectionConfig
 * @property {String} host
 * @property {String} port
 * @property {String} user - The DB Username
 * @property {String} password - The DB Password
 * @property {String} db
 */

export default ConnectionConfig

/**
* @typedef DatabaseSetupTask
* @property {String} cmd
* @property {Tenant} tenant
* @property {ConnectionConfig} connectionInfo
*/

export default DatabaseSetupTask

/**
 * @typedef {Object} OwnerDetails
 * @property {String} username
 * @property {String} email
 * @property {String} password
 * @property {String} role
 * @property {String} status
 */

/**
 * @typedef  {Object} OrganizatiionSetupTask
 * @property {String} cmd
 * @property {Tenant} tenant
 * @property {ConnectionConfig} connectionInfo
 * @property {(OwnerDetails|undefined)} owner
 */

export default OrganizatiionSetupTask


/**
 * @typedef  {Object} EmailTask
 * @property {String} cmd
 * @property {String} type
 * @property {Object} payload
 */

export default EmailTask


/**
* @typedef CronTask
* @property {String} cmd task name 
* @property {String} cronTab cron expersiion 
*/


export default CronTask

