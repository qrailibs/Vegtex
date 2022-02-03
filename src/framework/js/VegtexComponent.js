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

        // HTML attributes of component
        this.attributes = data?.attributes || {}

        // HTML & Custom events on component
        this.events = data?.events || {}

        // CSS style of component
        this.style = data?.style

        // Locals (Methods, Variables)
        this.locals = data?.locals || {}

        // Template of component
        this.template = data?.template || ``

        // Render way
        this.renderWay = data?.renderWay || VegtexComponent.renderWays.dom
    
        // Init in DOM
        this.__initTag__()
    }



    /**
     * Define component attribute that will be observed
     * @param {string} attribute - Attribute name
     * @param {attrCallback} onChange - when attribute value of any component instance was changed
     */
    defineAttribute(attribute, onChange) {
        this.attributes[attribute] = onChange
    }



    /**
     * Available built-in component events
     * @enum {string}
     */
    static get events() {
        return {
            preRender: '__prerender__',
            postRender: '__postrender__',

            added: '__added__',
            removed: '__removed__',
            adopted: '__adopted__',

            defined: '__defined__'
        }
    }

    /**
     * Add global event listener for all instances of component
     * @param {vegtextEvent|string} event - DOM event name
     */
    addEventListener(event, callback) {
        this.events[event] = callback
    }

    /**
     * Define component local method or variable
     * @param {string} name - name of the local
     * @param {object} value - value of the local
     */
    defineLocal(name, value) {
        this.locals[name] = value
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
                    
                    this.component = component

                    //initial inner nad outer html of current dom element
                    this.initialInner = this.innerHTML
                    this.initialOuter = this.outerHTML
                    
                    //init
                    this.component.__initInstance__(this)

                    //attach shadow dom
                    this.component.__attachShadow__(this)
                    
                    //render
                    this.component.__renderInstance__(this)

                    //define locals (methods, properties)
                    for(const localName of Object.keys(component.locals)) {
                        this[localName] = component.locals[localName]
                    }
                }

                connectedCallback() {
                    //call event '__added__' (if handled)
                    if(this.component.events['__added__'])
                        this.component.events['__added__'](this)
                }
                disconnectedCallback() { 
                    //call event '__removed__' (if handled)
                    if(this.component.events['__removed__'])
                        this.component.events['__removed__'](this)
                }
                adoptedCallback() { 
                    //call event '__adopted__' (if handled)
                    if(this.component.events['__adopted__'])
                        this.component.events['__adopted__'](this)
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
                    //call attrs observers
                    if(this.component.attributes.constructor == Object) {
                        //call attribute change (if this attribute is observed)
                        if(this.component.attributes[attrName] !== undefined)
                            this.component.attributes[attrName](this, oldVal, newVal)
                    }
                    
                    //render
                    if(this.hasAttribute('dynamic') && this.attributes['dynamic'] != 'false') {
                        this.component.__renderInstance__(this)
                    }
                }
            }
        )

        //call tag initialization event
        if(component.events['__defined__']) 
            component.events['__defined__'](component)

        //style
        if(this.style) {
            document.getElementById('vegtex-style').innerHTML += this.style.css(this.tag)
        }
    }

    /**
     * Initialize instance of component
     * @private
     * @param {Object} instance - DOM element instance to initialize
     */
    __initInstance__(instance) {
        //observe events
        for(var event_name in this.events) {
            var event_func = this.events[event_name]

            //if its default event (not nondefault like '__adopted__', etc)
            if(!event_name.startsWith('__')) {
                instance.addEventListener(event_name, function(e) { event_func(instance, e) } )
            }
        }

        //call init event
        if(this.events['__init__'] !== undefined) this.events['__init__'](instance)
    }

    /**
     * Attach shadow to connected instance
     * @param {Object} instance - DOM element instance
     */
    __attachShadow__(instance) {
        const shadowMode = 'closed'

        //use shadow dom only if required (for style or rendering)
        if(this.style || this.renderWay === VegtexComponent.renderWays.shadowDom)
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
        //prerender event
        if(this.events['__prerender__'] !== undefined)
            this.events['__prerender__'](instance)
        
        //templating (JS)
        if(this.template !== undefined && this.template != '') {
            //context with variables
            var context = {
                inside: false,

                component: undefined,

                inner: instance.initialInner,
                outer: instance.initialOuter
            }
            context.component = this

            //attributes
            if(instance.hasAttributes()) {
                for(var attr in this.attributes) {
                    context[this.attributes[attr].name] = this.attributes[attr].textContent
                }
            }

            //render with template
            var rendered = this.template.call(context)

            //basic DOM
            if(this.renderWay == VegtexComponent.renderWays.dom) {
                //render as child of component
                if(context.inside)
                    instance.innerHTML = rendered
                //render as replacement
                else
                    instance.outerHTML = rendered
            }
            //shadow DOM
            else if(this.renderWay == VegtexComponent.renderWays.shadowDom) {
                //render as child of component
                if(context.inside)
                    this.__renderShadow__(instance, `
                        ${this.style ? `<style>${this.style.css}</style>` : ''}
                        ${instance.initialInner}
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
                ${instance.initialInner}
            `)
        }

        //postrender event
        if(this.events['__postrender__'] !== undefined)
            this.events['__postrender__'](instance)
    }
}