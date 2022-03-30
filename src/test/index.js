import vegtex from '../framework/js/vegtex'

vegtex.use('dark', 'azure')

new vegtex.VegtexComponent('vg-counter', {
    template() {
        return `
            <p>Clicked ${this.state.x} times</p>
        `
    },
    style: (Style)  => ({
        ':host': [
            // Background & Text color
            Style.BgColor.color10,
            Style.TextColor.color0,
            
            // Content auto-flow
            Style.AutoContent,
            Style.Align.Center,
            Style.Justify.Center,
            
            // Margin & Padding
            Style.Margin.Top.px(25),
            Style.Padding.All.px(25),
            
            // Cursor, text selection
            Style.Cursor.Clickable,
            Style.Selection.None,
            
            // Border rounding
            Style.Rounding.Default,
            
            // Smooth transitions
            Style.Transition.Smooth
        ],
        ':hover': [
            Style.BgColor.color9,
        ]
    }),
    events: {
        click(e) {
            this.state.x++
            console.log(this.state.x)
        }
    },

    state: () => ({
        x: 0
    }),
})

const routes = {
    'index': `<p>index page</p>`,
    'info': `<p>information page</p>`
}

vegtex.createRouter(routes, {
    mode: 'spa'
})