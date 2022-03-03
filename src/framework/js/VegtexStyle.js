export default class VegtexStyle {
    /**
    * Get all available CSS variables
    *
    * @static
    */
    static variables() {
        var style = getComputedStyle(document.body)

        return {
            color0: style.getPropertyValue('--color-0'),
            color1: style.getPropertyValue('--color-1'),
            color2: style.getPropertyValue('--color-2'),
            color3: style.getPropertyValue('--color-3'),
            color4: style.getPropertyValue('--color-4'),
            color5: style.getPropertyValue('--color-5'),
            color6: style.getPropertyValue('--color-6'),
            color7: style.getPropertyValue('--color-7'),
            color8: style.getPropertyValue('--color-8'),
            color9: style.getPropertyValue('--color-9'),
            color10: style.getPropertyValue('--color-10'),
            color11: style.getPropertyValue('--color-11'),

            colorSuccess: style.getPropertyValue('--color-success'),
            colorWarning: style.getPropertyValue('--color-warning'),
            colorDanger: style.getPropertyValue('--color-danger'),

            borderWidth: style.getPropertyValue('--border-width').trim(),
            borderRadius: style.getPropertyValue('--border-radius').trim(),

            transition: style.getPropertyValue('--transition'),

            //TODO: text sizes, shadows, transition, fonts
        }
    }

    /**
    * Create CSS style
    *
    * @constructor
    * @this  {VegtexStyle}
    * @param {Array.<VegtexStyleRule>} props CSS Properties and values.
    */
    constructor(propsCallback) {
        this.propsCallback = propsCallback
        this.additionalProps = {}
    }

    /**
    * Add additional CSS property
    *
    * @this  {VegtexStyle}
    * @param {String} prop CSS property name
    * @param {String} value CSS property value
    */
    addAdditional(prop, value) {
        this.additionalProps[prop] = value
    }

    /**
    * Generate CSS for this style
    *
    * @this    {VegtexStyle}
    * @param   {String} selector Selector for css rule
    * @returns {String} Generated CSS
    */
    css(selector) {
        const states = {}

        // Actions for style composing
        const actions = {
            addState(state, handler) {
                states[state] = handler
            },

            addHover(handler) {
                actions.addState(':hover', handler)
            },
            addFocus(handler) {
                actions.addState(':focus', handler)
            }
        }
        // Theme variables for style composing
        const vars = VegtexStyle.variables()

        let props = {
            // Base state
            _: this.propsCallback.call({ ...actions, ...vars })
        }
        // Other states (hover, focus, etc)
        Object.keys(states).forEach(state => {
            let stateProps = states[state].call(vars)

            // Add state if has more than 0 props
            if(typeof stateProps === 'object' && Object.keys(stateProps).length > 0)
                props[state] = stateProps
        })

        // Remove base state if has no styles
        if(props._.length == 0)
            props._ = undefined
        // Return none if no states
        else if(Object.keys(props).length == 0) 
            return ''

        // Make CSS of base rule
        let rulesCss = ''
        Object.keys(props).forEach(state => {
            let stateProps = props[state]

            if(state === '_') {
                rulesCss += `${selector} {`
                // Computed
                for(const propName of Object.keys(stateProps)) {
                    rulesCss += `\n    ${propName.replaceAll('_','-')}: ${stateProps[propName]};`
                }
                // Additional
                for(const propName of Object.keys(this.additionalProps)) {
                    rulesCss += `\n    ${propName.replaceAll('_','-')}: ${this.additionalProps[propName]};`
                }
            }
            else {
                rulesCss += `${selector}${state} {`
                // Computed
                for(const propName of Object.keys(stateProps)) {
                    rulesCss += `\n    ${propName.replaceAll('_','-')}: ${stateProps[propName]};`
                }
            }

            rulesCss += '\n}\n'
        })

        return rulesCss
    }
}