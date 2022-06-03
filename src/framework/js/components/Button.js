import VegtexComponent from "../VegtexComponent";

export const Button = new VegtexComponent('vg-button', {
    extends: {
        el: HTMLButtonElement,
        tag: 'button'
    }
})