export default class VegtexStorage {
    constructor(options) {
        // State
        this.state = options.state || {}

        // Actions
        this.actions = options.actions || {}

        // Mutations
        this.mutations = options.mutations || {}

        // Events
        this.events = {}
        if(options.events) {
            Object.keys()
        }
    }

    // Actions
    createAction() {

    }
    dispatch() {

    }

    // Mutations
    createMutation() {
        
    }
    commit() {

    }

    // Events
    createEvent(name) {
        this.events[name] = {
            handlers: []
        }
    }
    subscribe(event, handler) {
        if(this.events[event]) {
            this.events[event].handlers.push(handler)
        }
        else
            throw new Error(`Event '${event}' is not exists`)
    }
    emit(event, ...args) {
        if(this.events[event]) {
            this.events[event].handlers.forEach(handler => {
                handler(args)
            })
        }
        else
            throw new Error(`Event '${event}' is not exists`)
    }
}