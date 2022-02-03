// Base CSS
import '../css/all.scss'

// Base JS
import VegtexComponent from './VegtexComponent.js'
import VegtexStyle from './VegtexStyle.js'

// Components: Base
import { Card } from './components/Card'
import { Icon } from './components/Icon'
import { IconStack } from './components/IconStack'
import { Badge } from './components/Badge'
import { Progress } from './components/Progress'
//TODO: List
import { Item } from './components/Item'

// Components: SPA
import { Sidebar } from './components/Sidebar'

// API
const vegtex = {
    use: function(scheme, schemeAccent) {
        //validate scheme
        if(!scheme || (scheme !== 'dark' && scheme !== 'light'))
            throw new Error('You should specify valid scheme ("dark" or "light")')
        //validate accent
        if(!schemeAccent)
            throw new Error('You should specify scheme accent')

        //apply style scheme
        document.body.className = `vg-app theme-${scheme} accent-${schemeAccent}`

        //add global vegtex styles
        const vegtexStyles = document.createElement('style')
        vegtexStyles.setAttribute('id', 'vegtex-style')
        document.head.appendChild(vegtexStyles)
    },

    /** @type {Object} Registered global observed attributes */
    attributes: {},
    defineAttribute: function(query, attr, callback) {
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
}

export {
    VegtexComponent,
    VegtexStyle,
    vegtex
}