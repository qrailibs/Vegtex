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
        //HTML tag of component
        this.tag = tag

        //HTML attributes of component
        this.attributes = data?.attributes || {}

        //HTML & Custom events on component
        this.events = data?.events || {}

        //CSS style of component
        this.style = data?.style ? new VegtexStyle(data.style) : null

        //JS Methods
        this.methods = data?.methods || {}

        //Template of component
        this.template = data?.template || ``

        //Render way
        this.renderWay = data?.renderWay || 'dom'
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
     * Attach shadow to connected instance
     * @param {Object} instance - DOM element instance
     */
    __attachShadow__(instance) {
        const shadowMode = 'closed'

        //use shadow dom only if required (for style or rendering)
        if(this.style || this.renderWay === 'shadow')
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
     * Define component method
     * @param {string} name - Method name
     * @param {methodCallback} method - Function that will be called
     */
    defineMethod(name, method) {
        this.methods[name] = method
    }

    /**
     * Initialize instance of component
     * @private
     * @param {Object} instance - DOM element instance to initialize
     */
    __initInstance__(instance) {
        //apply styling
        //for(var cssprop_name in this.style) {
        //    var cssprop_value = this.style[cssprop_name]
        //    instance.style[cssprop_name] = cssprop_value
        //}

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
            if(this.renderWay == 'dom') {
                //render as child of component
                if(context.inside)
                    instance.innerHTML = rendered
                //render as replacement
                else
                    instance.outerHTML = rendered
            }
            //shadow DOM
            else if(this.renderWay == 'shadow') {
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
        else if(this.renderWay == 'shadow') {
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