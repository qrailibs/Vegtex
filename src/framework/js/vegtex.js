//CSS
import '../css/main.scss'
//JS
import VegtexComponent from './VegtexComponent.js'
import VegtexStyle from './VegtexStyle.js'

const vegtex = {
    /** @type {Object} Registered vegtex components */
    components: {},
    defineComponent: function(component) {
        //verify that 'component' argument is set
        if(component == undefined || !component instanceof VegtexComponent)
            throw new Error('You should specify what component to define via "VegtexComponent" class instance')

        window.customElements.define(component.tag.toLowerCase(), 
            class Tag extends HTMLElement { 
                constructor() {
                    //init
                    super()

                    this.component = component

                    //initial inner nad outer html of current dom element
                    this.initialInner = this.innerHTML
                    this.initialOuter = this.outerHTML
                    
                    //init
                    this.component.__initInstance__(this)

                    //render
                    this.component.__renderInstance__(this)
                }

                connectedCallback() { 
                    //call event '__added__' (if handled)
                    if(this.component.events['__added__'] !== undefined)
                        this.component.events['__added__'](this)
                }
                disconnectedCallback() { 
                    //call event '__removed__' (if handled)
                    if(this.component.events['__removed__'] !== undefined)
                        this.component.events['__removed__'](this)
                }
                adoptedCallback() { 
                    //call event '__adopted__' (if handled)
                    if(this.component.events['__adopted__'] !== undefined)
                        this.component.events['__adopted__'](this)
                }

                static get observedAttributes() {
                    let observed = []

                    //without or with observers
                    if(component.attributes.constructor == Array) { observed = component.attributes }
                    else if(component.attributes.constructor == Object) { observed = Object.keys(component.attributes) }
                    
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

        //initialize
        this.components[component.tag] = component

        //call tag initialization event
        if(component.events['__defined__'] !== undefined) component.events['__defined__'](this)
    },
    isComponentDefined: function(tag) {
        return this.components[tag] !== undefined
    },

    /** @type {Object} Registered vegtex components attributes */
    attributes: {},
    defineAttribute: function(query, attr, callback = function(el, newVal) {}) {
        var targets = document.querySelectorAll(query);

        //every target on page
        targets.forEach(target => {
            //callback if attr value set
            if(target.hasAttribute(attr)) {
                //do callback (page is loaded)
                callback(target, target.attributes[attr].value);
            }

            //observe attributes
            new MutationObserver((mutations, observer) => {
                for(let mutation of mutations) {
                    //if mutation is attribute && observed attribute mutated
                    if(mutation.type == 'attributes' && mutation.attributeName == attr) {
                        //do callback (attr is changed)
                        callback(mutation.target, mutation.target.attributes[attr].value);
                    }
                }
            }).observe(target, { attributes: true });
        });

        //initialize
        this.attributes[attr] = {
            query: query
        };
    },
    isAttributeDefined: function(attr) {
        //check custom attributes
        if(this.attributes[attr] !== undefined) { return true; }
        
        //check components attributes
        this.components.forEach(tag => {
            if(tag.attributes.includes(attr)) {
                return true;
            }
        });

        //-> not found
        return false;
    },

    /**
    * Find components elements by CSS selector
    *
    * @returns {Object} Object with found elements
    */
    $: function(query) {
        //result
        var result = {
            elements: []
        }

        //find elements
        var els = document.querySelectorAll(query)
        els.forEach(el => {
            const tag = el.tagName.toLowerCase()

            //component found
            if(vegtex.isComponentDefined(tag)) {
                var element = {
                    instance: el,
                    component: vegtex.components[tag]
                }

                // Methods -----
                element.setAttr = function(attr, value) {
                    if(this.instance.attributes[attr] !== undefined)
                        this.instance.attributes[attr].value = value
                }
                Object.keys(element.component.methods).forEach(methodName => {
                    //add method to element
                    element[methodName] = function(...args) {
                        //call component method with instance
                        this.component.methods[methodName].call(element, ...args)
                    }
                })

                //add element
                result.elements.push(element)
            }
            //component not found
            else {
                console.error(`<${tag}> was not Vegtex Component`)
            }
        })

        //return result
        return result
    }
}

//sidebar
var sidebar = new VegtexComponent('vg-sidebar')
sidebar.methods = {
    increase: function(val) {
        console.log('increasing ' + val)
    }
}
vegtex.defineComponent(sidebar)
vegtex.$('vg-sidebar').each(el => {
    el.increase(100)
})

export {
    VegtexComponent,
    VegtexStyle,
    vegtex
}