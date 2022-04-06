import VegtexComponent from "../VegtexComponent";

export const Component = new VegtexComponent('component', {
    state() {
        return {
            is: this.getAttribute('is') || null
        }
    },

    template() {
        return `<${this.state.is}>${this.$initialInner}</${this.state.is}>`
    }
})