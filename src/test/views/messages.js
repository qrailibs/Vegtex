import vegtex from '../../framework/js/vegtex'
const { VegtexComponent } = vegtex 

export default new VegtexComponent(null, {
    template() {
        return `
            <h2>Heading 2</h2>

            <button size-lg style-accent>Buy</button>
        `
    }
})