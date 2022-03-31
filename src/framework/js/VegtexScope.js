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

export default class VegtexScope {
    constructor(scopeName, props) {
        let scopeElementSelector = `[\\@scope="${scopeName}"]`

        // Wait for scope element
        waitFor(scopeElementSelector)
            .then(() => {
                // Element for scope
                this.element = document.querySelector(scopeElementSelector)
                // Element child elements
                this.element.querySelectorAll('[\\@click]').forEach(clickListenerEl => {
                    // Get method to call
                    let clickAction = clickListenerEl.getAttribute('@click')
                    // Add listener
                    clickListenerEl.addEventListener('click', (e) => this.props[clickAction](e))
                })
                
                // Make props (refs, methods)
                this.props = {}
                Object.keys(props).forEach(propKey => {
                    let prop = props[propKey]
    
                    // Reference
                    if(typeof prop === 'object' && prop.ref) {
                        this.props[propKey] = { 
                            type: 'ref', 
                            ref: prop.ref 
                        }
                    }
                    // Method
                    else if(typeof prop === 'function') {
                        this.props[propKey] = { 
                            type: 'method', 
                            method: prop
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
                    },
                    set: (target, name, value) => {
                        return false
                    }
                })
            })
    }
}