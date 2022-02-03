import { vegtex, VegtexComponent, VegtexStyle } from '../framework/js/vegtex'

vegtex.use('dark', 'azure')

new VegtexComponent('vg-counter', {
    events: {
        click: (instance, e) => {
            instance.x++
        }
    },
    locals: {
        x: 0
    },
    style: new VegtexStyle(function() {
        console.log(this)
        return {
            'display': 'block',
            'min-width': '100px',
            'min-height': '100px',
            'background': this.color10
        }
    })
})