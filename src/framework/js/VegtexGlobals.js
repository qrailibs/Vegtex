export default new class {
    /**
     * Initialize globals
     * @function
     */
    init() {
        window.$globals = {}
    }

    /**
     * Get global variable value
     * @function
     * @param {string} globalName
     */
    get(globalName) {
        if(window.$globals)
            return window.$globals[globalName]
        else
            throw new Error(`Failed to get global '${globalName}', you should do vegtex.use before`)
    }
    /**
     * Set global variable value
     * @function
     * @param {string} globalName
     * @param {Object} globalValue
     */
    set(globalName, globalValue) {
        if(window.$globals)
            window.$globals[globalName] = globalValue
        else
            throw new Error(`Failed to set global '${globalName}', you should do vegtex.use before`)
    }
    /**
     * Check is global variable exists
     * @function
     * @param {string} globalName
     */
    exists(globalName) {
        return window.$globals && window.$globals[globalName]
    }

    /**
     * Save globals to LocalStorage
     * @function
     */
    save() {
        localStorage.set('vegtex.$globals', JSON.stringify(window.$globals))
    }
    /**
     * Load globals from LocalStorage
     * @function
     */
    load() {
        window.$globals = localStorage.get('vegtex.$globals') || {}
    }
}