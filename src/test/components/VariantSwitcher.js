import vegtex from "../../framework/js/vegtex"
const { VegtexComponent } = vegtex

export default new VegtexComponent('variant-switcher', {
    template() {
        return /*html*/`
            <div class="switcher-variants">
                ${Object.keys(this.props.variants).map(variantIndex => /*html*/`
                    <button data-variant="${variantIndex}">
                        ${this.props.variants[variantIndex].title}
                    </button>
                `).join('')}
            </div>
            <div class="switcher-preview">
                ${this.props.variants[this.state.currentVariant].element}
            </div>
        `
    },
    style: (Style) => ({
        ':host': [
            Style.AutoContent,
            Style.Direction.Vertical,
            Style.Gap.rem(1),

            Style.BgColor.color10,
            Style.Rounding.px(10),

            Style.Padding.All.rem(1),
        ],
        '> .switcher-variants': [
            Style.AutoContent,
            Style.Direction.Horizontal,
            Style.Gap.rem(0.6),

            Style.Margin.Bottom.rem(1)
        ],
        '> .switcher-variants > button': [
            Style.AutoContent,
            Style.Direction.Horizontal,

            Style.Width.fill,
            Style.Padding.Top.rem(0.6),
            Style.Padding.Bottom.rem(0.6),

            Style.BgColor.color9,
            Style.TextColor.color1,
            Style.TextSize.px(16),

            Style.Outline.None,
            Style.Border.None,

            Style.Rounding.px(6),
        ],
        '> .switcher-variants > button:hover': [
            Style.BgColor.color8,
        ],
        '> .switcher-preview > *': [
            Style.TextAlign.Center,
            Style.SelfCentered,
        ],
    }),

    props: () => [
        'variants',
        'current-variant'
    ],

    events: {
        '.switcher-variants > button:click'(e) {
            this.state.currentVariant = parseInt(e.target.getAttribute('data-variant'))
        }
    },
    
    state() {
        return {
            currentVariant: this.props['current-variant'] || 0
        }
    }
})