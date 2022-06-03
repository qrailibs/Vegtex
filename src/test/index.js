import vegtex from '../framework/js/vegtex'

import buttons from './views/buttons.js'
import cards from './views/cards.js'

vegtex.use('dark', 'azure')

const routes = {
    'index': buttons,
    'cards': cards,
}

vegtex.createRouter(routes, {
    mode: 'spa',

    // No style
    linkStyle: (Style) => []
})