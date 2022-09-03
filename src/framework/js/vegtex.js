// Base CSS
import '../css/all.scss'

// Base JS
import VegtexComponent from './VegtexComponent'
import VegtexStyle from './VegtexStyle'
import VegtexGlobals from './VegtexGlobals'
import VegtexScope from './VegtexScope'

// Components: Base
import { Button } from './components/Button'
import { Card } from './components/Card'
import { Icon } from './components/Icon'
import { IconStack } from './components/IconStack'
import { Badge } from './components/Badge'
import { Alert } from './components/Alert'
import { Progress } from './components/Progress'
import { Tabs } from './components/Tabs'
//TODO: List, Shield, etc
import { Item } from './components/Item'

// Components: SPA
import { Sidebar } from './components/Sidebar'

// Modules
import { createRouter } from './modules/router'

function use(scheme, schemeAccent) {
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

    //init globals
    VegtexGlobals.init()
}

export default { 
    // Base functions
    use,

    // Router functions
    createRouter,

    // Base classes
    VegtexComponent, VegtexStyle, VegtexGlobals, VegtexScope
}