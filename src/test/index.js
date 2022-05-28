import vegtex from '../framework/js/vegtex'

import dashboard from './views/dashboard.js'
import messages from './views/messages.js'

vegtex.use('dark', 'azure')

const routes = {
    index: dashboard,
    messages: messages,
}

vegtex.createRouter(routes, {
    mode: 'spa',

    // No style
    linkStyle: (Style) => []
})