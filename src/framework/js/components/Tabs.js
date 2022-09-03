import VegtexComponent from "../VegtexComponent";

export const Tabs = new VegtexComponent('vg-tabs', {
    props: () => [
        'variants',
        'current-variant'
    ],

    state() {
        return {
            currentVariant: this.props['current-variant'] || 0
        }
    },

    methods() {
        return {
            isActive(index) {
                return this.state.currentVariant === index
            }
        }
    },

    template() {
        return /*html*/`
            <div class="tabs">
                ${Object.keys(this.props.variants).map(variantIndex => /*html*/`
                    <button data-variant="${variantIndex}" class="${this.state.currentVariant == variantIndex ? 'active' : ''}">
                        ${this.props.variants[variantIndex].title}
                    </button>
                `).join('')}
            </div>
            <div class="page">
                ${this.props.variants[this.state.currentVariant].element}
            </div>
        `
    },

    events: {
        '.tabs > button@click'(e) {
            this.state.currentVariant = parseInt(e.target.getAttribute('data-variant'))
        }
    },
})