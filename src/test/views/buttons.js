import vegtex from '../../framework/js/vegtex'
const { VegtexComponent } = vegtex 

import '../components/VariantSwitcher'

export default new VegtexComponent(null, {
    state() {
        return {
            sizes: [
                {
                    title: 'Extra large',
                    element: `<button is='vg-button' size-xl style-accent>Button</button>`
                },
                {
                    title: 'Large',
                    element: `<button is='vg-button' size-lg style-accent>Button</button>`
                },
                {
                    title: 'Medium',
                    element: `<button is='vg-button' size-md style-accent>Button</button>`
                },
                {
                    title: 'Small',
                    element: `<button is='vg-button' size-sm style-accent>Button</button>`
                },
                {
                    title: 'Extra small',
                    element: `<button is='vg-button' size-xs style-accent>Button</button>`
                }
            ],
            styles: [
                {
                    title: 'Accent',
                    element: `<button is='vg-button' size-md style-accent>Button</button>`
                },
                {
                    title: 'Light',
                    element: `<button is='vg-button' size-md style-light>Button</button>`
                },
                {
                    title: 'Secondary',
                    element: `<button is='vg-button' size-md style-secondary>Button</button>`
                },
                {
                    title: 'Ghost',
                    element: `<button is='vg-button' size-md style-ghost>Button</button>`
                },
                {
                    title: 'Outline',
                    element: `<button is='vg-button' size-md style-outline>Button</button>`
                },
            ]
        }
    },
    template() {
        return /*html*/`
            <h2>Sizes</h2>
            <variant-switcher :variants="${this.$(this.state.sizes)}"></variant-switcher>

            <h2>Styles</h2>
            <variant-switcher :variants="${this.$(this.state.styles)}"></variant-switcher>

            <h2>With Icon</h2>
            <button is="vg-button" size-md style-accent type-icon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.796 4.13609C12.8136 3.12147 11.1863 3.12147 10.2039 4.13608L5.40546 9.09182C5.12987 9.37643 4.94469 9.73624 4.87323 10.1259C4.29047 13.3039 4.24745 16.5573 4.74599 19.7496L4.92249 20.8798C4.97824 21.2368 5.2857 21.5 5.64701 21.5H8.99997C9.27611 21.5 9.49997 21.2761 9.49997 21V14H14.5V21C14.5 21.2761 14.7238 21.5 15 21.5H18.3529C18.7142 21.5 19.0217 21.2368 19.0774 20.8798L19.2539 19.7496C19.7524 16.5573 19.7094 13.3039 19.1267 10.1259C19.0552 9.73624 18.87 9.37643 18.5944 9.09182L13.796 4.13609Z"></path></svg>
            </button>
            <button is="vg-button" size-md style-light type-icon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.796 4.13609C12.8136 3.12147 11.1863 3.12147 10.2039 4.13608L5.40546 9.09182C5.12987 9.37643 4.94469 9.73624 4.87323 10.1259C4.29047 13.3039 4.24745 16.5573 4.74599 19.7496L4.92249 20.8798C4.97824 21.2368 5.2857 21.5 5.64701 21.5H8.99997C9.27611 21.5 9.49997 21.2761 9.49997 21V14H14.5V21C14.5 21.2761 14.7238 21.5 15 21.5H18.3529C18.7142 21.5 19.0217 21.2368 19.0774 20.8798L19.2539 19.7496C19.7524 16.5573 19.7094 13.3039 19.1267 10.1259C19.0552 9.73624 18.87 9.37643 18.5944 9.09182L13.796 4.13609Z"></path></svg>
            </button>
            <button is="vg-button" size-md style-secondary type-icon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.796 4.13609C12.8136 3.12147 11.1863 3.12147 10.2039 4.13608L5.40546 9.09182C5.12987 9.37643 4.94469 9.73624 4.87323 10.1259C4.29047 13.3039 4.24745 16.5573 4.74599 19.7496L4.92249 20.8798C4.97824 21.2368 5.2857 21.5 5.64701 21.5H8.99997C9.27611 21.5 9.49997 21.2761 9.49997 21V14H14.5V21C14.5 21.2761 14.7238 21.5 15 21.5H18.3529C18.7142 21.5 19.0217 21.2368 19.0774 20.8798L19.2539 19.7496C19.7524 16.5573 19.7094 13.3039 19.1267 10.1259C19.0552 9.73624 18.87 9.37643 18.5944 9.09182L13.796 4.13609Z"></path></svg>
            </button>
        `
    },
    style: (Style) => ({
        '> h2': [
            Style.Margin.Top.rem(2)
        ],
        '> button': [
            Style.Margin.Bottom.rem(1)
        ]
    })
})