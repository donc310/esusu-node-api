/**
 * @typedef {import('objection').Model} Model
 * @typedef {import('passport-jwt').VerifiedCallback} JwyDone
 */

import crypto from "crypto"

/**
 * 
 * @param {*} message 
 * @param {*} algo 
 * @param {*} key 
 * @param {*} iv_length 
 * @param {*} type 
 * @returns 
 */
export function decrypt(message, algo, key, iv_length, type = String) {
    let _key
    if (typeof key === "string") _key = Buffer.from(key, 'hex');
    else _key = key

    if (type === String) {
        var iv = message.slice(0, iv_length);
        var content = message.slice(iv_length, message.length);
        var decipher = crypto.createDecipheriv(algo, _key, Buffer.from(iv));
        let decryptedData = decipher.update(content, "hex", "utf-8") + decipher.final("utf8");
        return decryptedData
    }

    var previous = Buffer.from(message);
    var iv = previous.slice(0, iv_length);
    var content = previous.slice(iv_length, previous.length);
    var decipher = crypto.createDecipheriv(algo, _key, iv);
    var data = decipher.update(content, undefined, 'utf8') + decipher.final('utf8');
    return JSON.parse(data);
}

function _makePrefix(length) {
    var r = "", c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        r += c.charAt(Math.floor(Math.random() * c.length));
    }
    return r;
}
/**
 * 
 * @param {(String|Buffer)} message 
 * @param {String} algo 
 * @param {crypto.CipherKey} key 
 * @param {Number} iv_length 
 * @param {(String|Buffer)} type 
 * @returns 
 */
export function encrypt(message, algo, key, iv_length,type = String){
    if (type === String) {
        const prefix = _makePrefix(iv_length)
        const new_iv = Buffer.from(prefix, 'utf-8')
        const cipher = crypto.createCipheriv(algo, key, new_iv);
        let data = cipher.update(message, "utf-8", "hex") + cipher.final("hex")
        return prefix + data
    }
    const new_iv = crypto.randomBytes(iv_length);
    const cipher = crypto.createCipheriv(algo, key, new_iv);
    cipher.end(JSON.stringify(message), 'utf-8');
    return Buffer.concat([new_iv, cipher.read()]);
}

export default function Encryption(options) {

    const key = Buffer.from(options.key, 'hex')
    const algorithm = options.algorithm || "aes-256-cbc"
    const iv_length = options.iv_length || 16
    const encrytedFields = options.encrytedFields || {}

    /**
     * @param {Model} Model
     */
    return (Model) => {
        return class extends Model {
            $formatDatabaseJson(json) {
                for (const [field, type] of Object.entries(encrytedFields)) {
                    if (json[field] !== undefined) {
                        json[field] = this.encrypt(json[field], type)
                    }
                }

                return super.$formatDatabaseJson(json);
            }

            $parseDatabaseJson(json) {
                json = super.$parseDatabaseJson(json);
                for (const [field, type] of Object.entries(encrytedFields)) {
                    if (json[field] !== undefined) {
                        json[field] = this.decrypt(json[field], type)
                    }
                }
                return json;
            }
            /**
             * 
             * @param {(String|Buffer)} message 
             * @param {(String|Buffer)} type 
             */
            encrypt(message, type) {
                return encrypt(message,algorithm,key,iv_length,type)
            }
            /**
             * 
             * @param {(String|Buffer)} message 
             * @param {(String|Buffer)} type 
             */
            decrypt(message, type) {
                return decrypt(message, algorithm, key, iv_length, type)
            }

        }
    }
}