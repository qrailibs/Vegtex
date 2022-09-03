import VegtexComponent from "../VegtexComponent";

export const Progress = new VegtexComponent('vg-progress', {
    props: () => [
        'value'
    ],

    template() {
        return `
            <span style="width:${this.props.value ?? '0'}%;"></span>
        `
    }
})