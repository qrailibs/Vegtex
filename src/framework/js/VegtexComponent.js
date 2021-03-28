export default class VegtexComponent {
    constructor(tag, attributes = {}, events = {}, style = {}, template = ``) {
        //HTML tag of component
        this.tag = tag
        //HTML attributes of component
        this.attributes = attributes
        //HTML & Custom events on component
        this.events = events
        //CSS style of component
        this.style = style
        //Template of component
        this.template = template

        //generate CSS for component
        //this.css = Object.keys(component.style).map(function(prop) {
        //    return `${prop}: ${component.style[prop]};`
        //}).join('')
        //display as block (if 'display' value isn't set)
        //this.css += this.css.includes('display:') ? '' : 'display: block;'
    }

    //define HTML attribute for component
    defineAttribute(attribute, onChange) {
        this.attributes[attribute] = onChange
    }

    //add global event listener for all instances of component
    addEventListener(event, callback) {
        this.events[event] = callback
    }

    //add CSS style property to component
    addStyleProperty(styleProperty, value) {
        this.style[styleProperty] = value
    }

    //initialize instane of component
    __initInstance__(instance) {
        //apply styling
        for(var cssprop_name in this.style) {
            var cssprop_value = this.style[cssprop_name]
            instance.style[cssprop_name] = cssprop_value
        }

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

    //render instance of component
    __renderInstance__(instance) {
        //JS rendering
        if(this.events['__render__'] !== undefined) {
            //get rendered
            var rendered = this.events['__render__'](instance)

            //render into DOM
            if(rendered !== undefined && rendered != null)
                instance.innerHTML = rendered
        }

        //HTML templating
        else if(this.template !== undefined && this.template != '') {
            //assign {inner}
            var template = this.template.replaceAll('{inner}', instance.initialInner)
            
            //assign variables values
            if(instance.hasAttributes()) {
                for(var attr in this.attributes) {
                    template = template.replaceAll('{'+this.attributes[attr].name+'}', this.attributes[attr].textContent)
                }
            }

            //update DOM
            instance.innerHTML = template
        }
    }
}