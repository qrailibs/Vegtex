function waitFor(selector) {
    return new Promise(resolve => {
        // If already exists
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        // Make observer (on dom node added)
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        // Observe
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const events = [
    // Load / Unload
    'load', 'unload',
    // Click
    'click', 'dblclick',
    // Focus / Blue
    'focus', 'blur',
    // Key
    'keydown', 'keyup', 'keypress',
    // Mouse
    'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'wheel',
    // Drag
    'drag', 'dragend', 'dragleave', 'dragenter', 'dragover', 'dragstart', 'drop', 'scroll',
    // Input
    'change', 'input', 'select',
    // Form
    'submit', 'reset', 'invalid', 'search',
    // Clipboard
    'copy', 'cut', 'paste',
]

export default class VegtexScope {
    constructor(scopeName, props) {
        let scopeElementSelector = `[\\@scope="${scopeName}"]`

        // Wait for scope element
        waitFor(scopeElementSelector)
            .then(() => {
                // Element for scope
                this.element = document.querySelector(scopeElementSelector)
                this.props = {}

                // Make props (refs, methods)
                Object.keys(props).forEach(propKey => {
                    let prop = props[propKey]

                    // Method
                    if(typeof prop === 'function') {
                        this.props[propKey] = { 
                            type: 'method', 
                            method: prop
                        }
                    }
                    // Variable
                    else {
                        this.props[propKey] = { 
                            type: 'variable', 
                            value: prop
                        }
                    }
                })
                this.props = new Proxy(this.props, {
                    get: (target, name) => {
                        // Not found
                        if(!target[name])
                            return undefined
                        // Reference
                        else if(target[name].type === 'ref')
                            return this.element.querySelector(`[\\@ref="${target[name].ref}"]`)
                        // Method
                        else if(target[name].type === 'method')
                            return target[name].method.bind(this.props)
                        // Variable
                        else if(target[name].type === 'variable')
                            return target[name].value
                    },
                    set: (target, name, value) => {
                        // Variable
                        if(target[name].type === 'variable') {
                            target[name].value = value
                            return true
                        }
                        // Reference / Method
                        else
                            return false
                    }
                })
                
                // Loop scope elements
                const iterateChilds = (el) => {
                    for(const scopeEl of el.children) {
                        iterateChilds(scopeEl)
                        
                        // Loop attributes
                        for(const { name, value } of scopeEl.attributes) {
                            // Is scope handled
                            if(name.startsWith('@')) {
                                let scopeAttr = name.replace('@', '')
    
                                // Event
                                if(scopeAttr === 'ref') {
                                    this.props[value] = { 
                                        type: 'ref',
                                        ref: value
                                    }
                                }
                                // Binding
                                else if(scopeAttr === 'bind') {
                                    if(scopeEl.tagName === 'INPUT' || scopeEl.tagName === 'TEXTAREA')
                                        scopeEl.addEventListener('input', (e) => this.props[value] = e.target.value)
                                    else
                                        scopeEl.addEventListener('change', (e) => this.props[value] = e.target.value)
                                }
                                // HTML Event
                                else if(events.includes(scopeAttr)) {
                                    scopeEl.addEventListener(scopeAttr, (e) => this.props[value](e))
                                }
                                // Custom HTML Event
                                else if(scopeAttr == 'added') {
                                    this.props[value]({ target: scopeEl })
                                }
                            }
                        }
                    }
                }
                iterateChilds(this.element)
            })
    }
}