import { vegtex, VegtexComponent, VegtexStyle } from '../framework/js/vegtex'

vegtex.use('dark', 'azure')

new VegtexComponent('vg-counter', {
    template() {
        return `
            <p>Clicked ${this.x} times</p>
        `
    },
    style() {
        this.addHover(function() {
            return {
                background: this.color9
            }
        })

        return {
            display: 'flex',
            justify_content: 'center',
            align_items: 'center',

            min_width: '100px',
            min_height: '100px',

            margin_top: '25px',

            cursor: 'pointer',
            user_select: 'none',

            background: this.color10,

            border_radius: this.borderRadius,

            transition: this.transition
        }
    },
    events: {
        click(instance, e) {
            instance.$locals.x++
            console.log(instance.$locals.x)
        }
    },

    locals: {
        x: 0
    },
})