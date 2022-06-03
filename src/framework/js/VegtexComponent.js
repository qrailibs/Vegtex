import VegtexStyle from "./VegtexStyle"

export default class VegtexComponent {
    /**
     * Callback for observing attribute
     * @name attrCallback
     * @function
     * @param {Object} element
     * @param {string} oldAttrValue
     * @param {string} newAttrValue
     */
    /**
     * Callback for event
     * @name eventCallback
     * @function
     * @param {Object} element
     * @param {Object} event
     */
    /**
     * Callback for method
     * @name methodCallback
     * @function
     * @param {Object} element
     * @param {...Object} args
     */


    /**
     * Available rendering ways
     * @enum {string}
     */
    static get renderWays() {
        return {
            dom: 'dom',
            shadowDom: 'shadow'
        }
    }

    /**
     * Represents a vegtex component (tag in HTML)
     * @constructor
     * @param {string} tag - Tag that will represent this component in HTML
     */
    constructor(tag, data) {
        // HTML tag of component
        this.tag = tag || this.#generateTag()

        // Base HTML element
        this.extends = data?.extends
        if(this.extends && (!this.extends.el || !this.extends.tag))
            throw new Error('The extends value should be object with "el" and "tag" properties (For example: { el: HTMLButtonElement, tag: "button" })')

        // HTML & Custom events on component
        this.events = {}
        if(data?.events) {
            Object.keys(data.events).forEach(eventName => 
                this.addEventListener(eventName, data.events[eventName])
            )
        }

        // HTML Properties
        this.props = []
        if(data?.props && typeof data.props === 'function')
            this.props = data.props()
        else if(data?.props && Array.isArray(data.props))
            this.props = data.props

        // CSS style of component
        if(data?.style && typeof data?.style === 'function')
            this.style = new VegtexStyle(data.style)
        else if(data?.style && typeof data?.style === 'string')
            this.style = data.style
        else
            this.style = null

        // State (Methods, Variables)
        this.initialState = data?.state || (() => ({}))

        // Template of component
        this.template = data?.template || ``

        // Render way
        this.renderWay = data?.renderWay || VegtexComponent.renderWays.dom

        // Init in DOM
        this.#initTag()
    }

    #generateTag() {
        const length = 7
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789-'

        let randomChars = ''
        for (let i = 0; i < length; i++ ) {
            randomChars += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return `vg-${randomChars}`
    }

    use(slot = ``, attributes = {}) {
        return `<${this.tag} 
            ${Object.keys(attributes).map((attrName) => `${attrName}="${attributes[attrName]}"`).join(' ')}
        >
            ${slot || ''}
        </${this.tag}>`
    }



    /**
     * Available built-in component events
     * @enum {string}
     */
    static get events() {
        return [
            'defined',
            'created',
            'mounted',
            'unmounted',
            'adopted',
            'render',
            'prerender'
        ]
    }
    addEventListener(event, handler) {
        // Init event handlers
        if(!this.events[event])
            this.events[event] = []
        
        // Add event handler
        this.events[event].push(handler)
    }
    emit(event, instance, e = null) {
        // Is event handlers exists
        if(this.events[event]) 
            // Call each handler
            this.events[event].forEach(handler =>
                e ? handler.bind(instance)(e) : handler.bind(instance)()
            )
    }

    

    /**
     * Initialize HTML tag of component
     * @private
     */
    #initTag() {
        const component = this

        //define WebComponent
        window.customElements.get(component.tag.toLowerCase()) || window.customElements.define(component.tag.toLowerCase(), 
            class VegtexElement extends (component.extends?.el || HTMLElement) {
                constructor() {
                    //init
                    super()
                    
                    //component of the element
                    this.$component = component

                    //init props with existing/null value
                    this.props = {}
                    this.$component.props?.forEach?.(propName => {
                        const parsedValue = this.#parseProperty(propName)
                        if(parsedValue !== undefined)
                            this.props[propName] = parsedValue
                        else
                            this.props[propName] = undefined
                    })

                    //initial inner nad outer html of current dom element
                    this.$initialInner = this.innerHTML
                    this.$initialOuter = this.outerHTML

                    //make state object
                    let newState = {}
                    if(typeof component.initialState === 'function')
                        newState = component.initialState.bind(this)()
                    else if(typeof component.initialState === 'object')
                        newState = component.initialState
                    else
                        throw new Error('VegtexComponent should be of function or object type')

                    //set observable state
                    this.state = new Proxy(newState, {
                        get: (target, name) => {
                            return target[name]
                        },
                        set: (target, name, value) => {
                            if(target[name] !== undefined) {
                                //apply value
                                target[name] = value

                                //TODO: call watched variables
    
                                //rerender on local change
                                this.render()

                                //success
                                return true
                            }
                            else
                                return false
                        }
                    })
                    
                    //init
                    this.$component.#initInstance(this)

                    //attach shadow dom
                    this.$component.#attachShadow(this)
                    
                    //render
                    this.$component.#renderInstance(this)
                }

                render() {
                    this.$component.#renderInstance(this)
                }

                connectedCallback() {
                    this.$component.emit('mounted', this)
                }
                disconnectedCallback() { 
                    this.$component.emit('unmounted', this)
                }
                adoptedCallback() { 
                    this.$component.emit('adopted', this)
                }

                static get observedAttributes() {
                    return component.props || []
                }
                attributeChangedCallback(attrName, oldVal, newVal) {
                    const parsedValue = this.#parseProperty(attrName.replace(':', ''))
                    if(parsedValue !== undefined)
                        this.props[attrName] = parsedValue
                }

                #parseProperty(attrName) {
                    // Property with primitive value
                    if(this.$component.props.includes(attrName)) {
                        // Base attribute
                        if(this.hasAttribute(attrName))
                            return this.getAttribute(attrName)
                        // Property with object(JSON) value
                        else if(this.hasAttribute(':' + attrName)) {
                            const rawValue = this.getAttribute(':' + attrName).replaceAll("\\'", '"')
                            const objectValue = null

                            return JSON.parse(rawValue)
                        }
                    }
                    else
                        return undefined
                }
            },
            component.extends?.tag ? {extends:component.extends?.tag} : undefined
        )

        //call tag initialization event
        this.emit('defined', null)

        //style
        if(this.style) {
            if(this.style instanceof VegtexStyle) {
                //this.style.addAdditional('color', 'white')

                // Is global style exists
                if(document.getElementById('vegtex-style'))
                    document.getElementById('vegtex-style').innerHTML += this.style.css(this.tag)
                // Do after load
                else
                    document.addEventListener('DOMContentLoaded', () => document.getElementById('vegtex-style').innerHTML += this.style.css(this.tag))
            }
            else
                console.error('Error, expected VegtexStyle to be as component.style')
        }
    }

    #addEventListeners(instance, isOnRender) {
        //observe events
        for(let event_selector in this.events) {
            //if its default event (not nondefault like '__adopted__', etc)
            if(!VegtexComponent.events.includes(event_selector)) {
                let selector = null, type = null

                // No selector, just type
                if(event_selector.trim().startsWith(':') || !event_selector.includes(':')) {
                    type = event_selector.replace(':', '')
                }
                // With selector & type
                else {
                    [ selector, type ] = event_selector.split(':')
                    selector = selector.trim().replace(':host', '')
                }

                // Fix selector
                type = type.replaceAll(' ', '')

                // Self selector
                if(!isOnRender && selector === null || selector === '') {
                    instance.addEventListener(type, (e) => {
                        this.emit(event_selector, instance, e)
                    })
                }
                // Advanced selector
                else if(isOnRender) {
                    let elements = instance.querySelectorAll(selector)
                    elements.forEach(element => {
                        element.addEventListener(type, (e) => {
                            this.emit(event_selector, instance, e)
                        })
                    })
                }
            }
        }
    }

    /**
     * Initialize instance of component
     * @private
     * @param {Object} instance - DOM element instance to initialize
     */
    #initInstance(instance) {
        //observe events
        this.#addEventListeners(instance, false)

        //call init event
        this.emit('created', instance)
    }

    /**
     * Attach shadow to connected instance
     * @param {Object} instance - DOM element instance
     */
    #attachShadow(instance) {
        const shadowMode = 'open'

        //use shadow dom only if required (for style or rendering)
        if(this.renderWay === VegtexComponent.renderWays.shadowDom)
            instance.shadow = instance.attachShadow({mode: shadowMode})
    }
    /**
     * Render html into 
     * @param {Object} instance - DOM element instance
     */
    #renderShadow(instance, html) {
        //create template
        let templateEl = document.createElement('template')
        templateEl.innerHTML = html

        //clear normal dom
        instance.innerHTML = ''

        //render template to shadow dom
        instance.shadow.appendChild(templateEl)
    }

    /**
     * Render instance of component
     * @private
     * @param {Object} instance - DOM element instance to render
     */
    #renderInstance(instance) {
        //before render event
        this.emit('prerender', instance)
        
        //templating (JS)
        if(this.template !== undefined) {
            //render with template
            let rendered = instance.$initialInner
            // String template
            if(typeof this.template === 'string' && this.template.length > 0)
                rendered = this.template
            // Function template
            else if(typeof this.template === 'function') {
                const context = {
                    // Function to serialize values for html dom
                    $(value) {
                        const serialize = (val) => {
                            if(typeof val === 'object')
                                return stringify(val)
                            else if(typeof val === 'string')
                                return `\\'${val}\\'`
                            else if(typeof val === 'number')
                                return val
                        }
                        const stringify = (obj) => {
                            // Array
                            if(Array.isArray(obj)) {
                                return `[${obj.map(val => serialize(val)).join(',')}]`
                            }
                            // Object
                            else {
                                let props = []
                                Object.keys(obj).forEach(key => {
                                    props.push(`\\'${key}\\':${serialize(obj[key])}`)
                                })
                                
                                return `{${props.join(',')}}`
                            }
                        }

                        return stringify(value)
                    },
                    ...instance
                }
                rendered = this.template.bind(context)() || instance.$initialInner
            }

            //basic DOM
            if(this.renderWay == VegtexComponent.renderWays.dom) {
                instance.innerHTML = rendered
            }
            //shadow DOM
            else if(this.renderWay == VegtexComponent.renderWays.shadowDom) {
                this.#renderShadow(instance, `
                    ${this.style ? `<style>${this.style.css}</style>` : ''}
                    ${rendered}
                `)
            }
            //unknown way
            else
                throw new Error(`Invalid render way: '${this.renderWay}' (Expected 'dom' or 'shadow')`)
        }
        //shadow rendering initial
        else if(this.renderWay == VegtexComponent.renderWays.shadowDom) {
            this.#renderShadow(instance, `
                ${this.style ? `<style>${this.style.css}</style>` : ''}
                ${instance.$initialInner}
            `)
        }

        //after render event
        this.emit('render', instance)

        //observe child elements events
        this.#addEventListeners(instance, true)
    }
}