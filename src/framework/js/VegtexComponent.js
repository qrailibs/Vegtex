import VegtexStyle from "./VegtexStyle"

export default class VegtexComponent {
    /**
     * Create multiple components
     * @param {Array.<string>} tags - components names
     */
    static createMultiple(tags) {
        if(tags && Array.isArray(tags)) {
            let components = []

            tags.forEach(tag => {
                components.push(new VegtexComponent(tag))
            })

            return components
        }
        else
            throw new Error('Components tags was not passed')
    }

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
        this.tag = tag

        // HTML & Custom events on component
        this.events = {}
        if(data?.events) {
            Object.keys(data.events).forEach(eventName => {
                this.addEventListener(eventName, data.events[eventName])
            })
        }

        // CSS style of component
        this.style = data?.style && typeof data.style === 'function' 
            ? new VegtexStyle(data.style) : null

        // Locals (Methods, Variables)
        this.initialLocals = data?.locals || {}

        // Template of component
        this.template = data?.template || ``

        // Render way
        this.renderWay = data?.renderWay || VegtexComponent.renderWays.dom

        // Init in DOM
        this.__initTag__()
    }

    use(attributes, inner = '') {
        return `<${this.tag} 
            ${Object.keys(attributes).map((attrName) => `${attrName}="${attributes[attrName]}"`).join(' ')}
        >
            ${inner}
        </${this.tag}>`
    }



    /**
     * Available built-in component events
     * @enum {string}
     */
    static get events() {
        return {
            beforeRender: '__beforerender__',
            afterRender: '__afterrender__',

            added: '__added__',
            removed: '__removed__',
            adopted: '__adopted__',
            initialized: '__init__',

            defined: '__defined__'
        }
    }
    addEventListener(event, handler) {
        // Init event handlers
        if(!this.events[event])
            this.events[event] = []
        
        // Add event handler
        this.events[event].push(handler)
    }
    emit(event, data) {
        // Is event handlers exists
        if(this.events[event]) 
            // Call each handler
            this.events[event].forEach(handler =>
                Array.isArray(data) ?
                    handler(...data)
                    : handler(data)
            )
    }

    

    /**
     * Initialize HTML tag of component
     * @private
     */
    __initTag__() {
        const component = this;

        //define WebComponent
        window.customElements.define(component.tag.toLowerCase(), 
            class VegtexElement extends HTMLElement { 
                constructor() {
                    //init
                    super()
                    
                    //component of the element
                    this.$component = component

                    //initial inner nad outer html of current dom element
                    this.$initialInner = this.innerHTML
                    this.$initialOuter = this.outerHTML

                    //inititial values of locals (methods, properties)
                    this.$locals = component.initialLocals
                    this.$locals = new Proxy(this.$locals, {
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
                    this.$component.__initInstance__(this)

                    //attach shadow dom
                    this.$component.__attachShadow__(this)
                    
                    //render
                    this.$component.__renderInstance__(this)
                }

                render() {
                    this.$component.__renderInstance__(this)
                }

                connectedCallback() {
                    this.$component.emit(VegtexComponent.events.added, this)
                }
                disconnectedCallback() { 
                    this.$component.emit(VegtexComponent.events.removed, this)
                }
                adoptedCallback() { 
                    this.$component.emit(VegtexComponent.events.adopted, this)
                }

                static get observedAttributes() {
                    let observed = []

                    //without or with observers
                    if(component.attributes.constructor == Array) { 
                        observed = component.attributes 
                    }
                    else if(component.attributes.constructor == Object) { 
                        observed = Object.keys(component.attributes) 
                    }
                    
                    //observe dynamic attr
                    observed.push('dynamic')

                    return observed
                }
                attributeChangedCallback(attrName, oldVal, newVal) {
                    // Local is exists?
                    if(this.$locals[attrName]) {
                        // Reassign local
                        //this.$locals[attrName] = newVal
                    }
                }
            }
        )

        //call tag initialization event
        this.emit(VegtexComponent.events.defined, this)

        //style
        if(this.style) {
            if(this.style instanceof VegtexStyle) {
                this.style.addAdditional('color', 'white')
                document.getElementById('vegtex-style').innerHTML += this.style.css(this.tag)
            }
            else
                console.error('Error, expected VegtexStyle to be as component.style')
        }
    }

    /**
     * Initialize instance of component
     * @private
     * @param {Object} instance - DOM element instance to initialize
     */
    __initInstance__(instance) {
        //observe events
        for(let event_name in this.events) {
            //if its default event (not nondefault like '__adopted__', etc)
            if(!event_name.startsWith('__')) {
                instance.addEventListener(event_name, (e) => { 
                    this.emit(event_name, [instance, e])
                })
            }
        }

        //call init event
        this.emit(VegtexComponent.events.initialized, instance)
    }

    /**
     * Attach shadow to connected instance
     * @param {Object} instance - DOM element instance
     */
    __attachShadow__(instance) {
        const shadowMode = 'open'

        //use shadow dom only if required (for style or rendering)
        if(this.renderWay === VegtexComponent.renderWays.shadowDom)
            instance.shadow = instance.attachShadow({mode: shadowMode})
    }
    /**
     * Render html into 
     * @param {Object} instance - DOM element instance
     */
    __renderShadow__(instance, html) {
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
    __renderInstance__(instance) {
        //before render event
        this.emit(VegtexComponent.events.beforeRender, instance)
        
        //templating (JS)
        if(this.template !== undefined) {
            //context with variables
            const context = {
                $inside: true,
                $component: undefined,
                $inner: instance.$initialInner,
                $outer: instance.$initialOuter,
            }
            context.$component = this
            
            //add locals to context
            if(instance.$locals) {
                for(let localName of Object.keys(instance.$locals)) {
                    context[localName] = instance.$locals[localName] 
                }
            }

            //render with template
            let rendered = context.$inner
            // String template
            if(typeof this.template === 'string' && this.template.length > 0)
                rendered = this.template
            // Function template
            else if(typeof this.template === 'function')
                rendered = this.template.call(context) || context.$inner

            //basic DOM
            if(this.renderWay == VegtexComponent.renderWays.dom) {
                //render as child of component
                if(context.$inside)
                    instance.innerHTML = rendered
                //render as replacement
                else
                    instance.outerHTML = rendered
            }
            //shadow DOM
            else if(this.renderWay == VegtexComponent.renderWays.shadowDom) {
                //render as child of component
                if(context.$inside)
                    this.__renderShadow__(instance, `
                        ${this.style ? `<style>${this.style.css}</style>` : ''}
                        ${instance.$initialInner}
                    `)
                //render as replacement -> error
                else
                    throw new Error('Only rendering inside component allowed (due to shadow dom rendering)')
            }
            //unknown way
            else {
                throw new Error(`Invalid render way: '${this.renderWay}' (Expected 'dom' or 'shadow')`)
            }
        }
        //shadow rendering initial
        else if(this.renderWay == VegtexComponent.renderWays.shadowDom) {
            this.__renderShadow__(instance, `
                ${this.style ? `<style>${this.style.css}</style>` : ''}
                ${instance.$initialInner}
            `)
        }

        //after render event
        this.emit(VegtexComponent.events.afterRender, instance)
    }
}