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
     * Represents a vegtex component (tag in HTML)
     * @constructor
     * @param {string} tag - Tag that will represent this component in HTML
     */
    constructor(tag) {
        //HTML tag of component
        this.tag = tag
        //HTML attributes of component
        this.attributes = {}
        //HTML & Custom events on component
        this.events = {}
        //CSS style of component
        this.style = new VegtexStyle()
        //Template of component
        this.template = ``

        //generate CSS for component
        //this.css = Object.keys(component.style).map(function(prop) {
        //    return `${prop}: ${component.style[prop]};`
        //}).join('')
        //display as block (if 'display' value isn't set)
        //this.css += this.css.includes('display:') ? '' : 'display: block;'
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
    static get vegtextEvent() {
        return {
            preRender: '__prerender__',
            postRender: '__postrender__',
            added: '__added__',
            removed: '__removed__',
            adopted: '__adopted__',
            defined: '__defined__',
        }
    }
    /**
     * Add global event listener for all instances of component
     * @param {vegtextEvent|string} event - DOM event name
     * @param {eventCallback} callback - The author of the book.
     */
    addEventListener(event, callback) {
        this.events[event] = callback
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
                instance.addEventListener(event_name, function(e) { event_func(e.target) } )
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
            var context = {}

            //----- variables -----
            //options
            context.inside = false
            //component
            context.component = this
            //inner
            context.inner = instance.initialInner
            context.outer = instance.initialOuter
            //attributes
            if(instance.hasAttributes()) {
                for(var attr in this.attributes) {
                    context[this.attributes[attr].name] = this.attributes[attr].textContent
                }
            }

            //update DOM
            var rendered = this.template.call(context)
            //render as child of component
            if(context.inside)
                instance.innerHTML = rendered
            //render as replacement
            else
                instance.outerHTML = rendered
        }

        //postrender event
        if(this.events['__postrender__'] !== undefined)
            this.events['__postrender__'](instance)
    }
}