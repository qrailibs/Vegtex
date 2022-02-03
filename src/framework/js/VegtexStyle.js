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
    }

    /**
    * Generate CSS for this style
    *
    * @this    {VegtexStyle}
    * @returns {String} Generated CSS
    */
    css(selector) {
        const computedStyleProps = this.propsCallback.call(VegtexStyle.variables())

        // Return none if no props
        if(Object.keys(computedStyleProps).length < 1) 
            return ''

        // Make CSS
        var propsCss = ''
        for(const propName of Object.keys(computedStyleProps)) {
            propsCss += `\n    ${propName}: ${computedStyleProps[propName]};`
        }

        return `${selector} { ${propsCss}\n}`
    }
}