import vegtex from '../framework/js/vegtex'

vegtex.use('dark', 'azure')

const routes = {
    index: '<p> index page </p>',
    info: '<p> info page </p>'
}
vegtex.createRouter(routes, {
    mode: 'spa'
})

new vegtex.VegtexScope('my-scope', {
    text: null,

    setText() {
        this.text = 'Hello!'
    }
})