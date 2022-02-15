import {
    AppSettingsRepository
} from "../app/repositories"

export default class Service {
    constructor(configuration = {}) {
        this.configuration = configuration
    }
    static get suffix() {
        return ""
    }
    static get name() {
        return ""
    }
    static get configKey() {
        return `${this.name}__${this.suffix}`
    }
    static async loadConfigurations() {
        return new AppSettingsRepository()
            .query()
            .where('meta_key', 'like', `%__${this.suffix}`)
    }
    static async loadEnabledConfigurations() {
        const settings = await new AppSettingsRepository()
            .query()
            .where('meta_key', 'like', `%__${this.suffix}`)

        const enabledProviders = settings
            .filter((x) => x.meta_value.enabled)
            .map(x => x.meta_value)

        return enabledProviders

    }
    static async loadSettings() {
        const settings = await new AppSettingsRepository()
            .query()
            .where('meta_key', this.configKey)
            .first()
        return settings
    }
    /**
     * 
     * @param {String} key 
     */
    static async loadData(key) {
        const data = await new AppSettingsRepository()
            .query()
            .where('meta_key', key)
            .first()
        return data
    }
    /**
     * 
     * @param {String} meta_key 
     * @param {Map<String, Object>} meta_value 
     */
    static async createRecord(meta_key, meta_value) {
        const data = await new AppSettingsRepository()
            .query()
            .insertAndFetch({
                meta_key,
                meta_value
            })
        return data
    }
    static async deleteRecord(meta_key){
        await new AppSettingsRepository().query().where({meta_key}).delete()
    }
    /**
     *
     * @param {Number} duration
     * @returns
     */
    delay(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }
}