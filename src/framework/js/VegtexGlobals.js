export default {
    init() {
        window.globals = {}
    },

    exists(globalName) {
        return window.globals && window.globals[globalName]
    },

    get(globalName) {
        if(window.globals)
            return window.globals[globalName]
        else
            throw new Error(`Failed to get global '${globalName}', you should do vegtex.use before`)
    },

    set(globalName, globalValue) {
        if(window.globals)
            window.globals[globalName] = globalValue
        else
            throw new Error(`Failed to set global '${globalName}', you should do vegtex.use before`)
    }
}