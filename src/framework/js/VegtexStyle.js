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

            textSizeRegular: style.getPropertyValue('--text-size-regular'),
            textSizeSubtitle: style.getPropertyValue('--text-size-subtitle'),
            textSizeButton: style.getPropertyValue('--text-size-button'),
            textSizeMiniButton: style.getPropertyValue('--text-size-minibutton'),
            textSizeDescription: style.getPropertyValue('--text-size-description'),
            textSizeMiniDescription: style.getPropertyValue('--text-size-minidescription'),

            //TODO: text sizes, shadows, transition, fonts
        }
    }

    /**
    * Get all available CSS variables
    *
    * @static
    */
    static Style() {
        // Values templates for props
        const colorValues = (prop) => ({
            color0: val(prop, 'var(--color-0)'),
            color1: val(prop, 'var(--color-1)'),
            color2: val(prop, 'var(--color-2)'),
            color3: val(prop, 'var(--color-3)'),
            color4: val(prop, 'var(--color-4)'),
            color5: val(prop, 'var(--color-5)'),
            color6: val(prop, 'var(--color-6)'),
            color7: val(prop, 'var(--color-7)'),
            color8: val(prop, 'var(--color-8)'),
            color9: val(prop, 'var(--color-9)'),
            color10: val(prop, 'var(--color-10)'),
            color11: val(prop, 'var(--color-11)'),

            transparent: val(prop, 'transparent'),
            black: val(prop, 'black'),
            white: val(prop, 'white'),
            color: (name) => val(prop, name),

            rgb: (r, g, b) => val(prop, `rgb(${r}, ${g}, ${b})`),
            rgba: (r, g, b, a) => val(prop, `rgba(${r}, ${g}, ${b}, ${a})`),
            hex: (hexCode) => val(prop, `#${hexCode}`)
        })
        const fontSizeValues = (prop) => ({
            // TODO: text size variables, unit values
        })
        const unitValues = (prop) => ({
            px: (value) => val(prop, `${value}px`),
            rem: (value) => val(prop, `${value}rem`),
            em: (value) => val(prop, `${value}em`),
            vw: (value) => val(prop, `${value}vw`),
            vh: (value) => val(prop, `${value}vh`),
            percent: (value) => val(prop, `${value}%`),

            min: val(prop, 'min-content'),
            max: val(prop, 'max-content'),
            fit: val(prop, 'fit-content'),

            fill: val(prop, '100%'),
        })
        const sidesUnitValues = (prop) => ({
            Left: unitValues(`${prop}-left`),
            Right: unitValues(`${prop}-right`),
            Top: unitValues(`${prop}-top`),
            Bottom: unitValues(`${prop}-bottom`),

            All: unitValues(prop)
        })
        const borderStyleValues = (prop) => ({
            Solid: val(prop, 'solid'),
            Dashed: val(prop, 'dashed'),
            Dotted: val(prop, 'dotted'),
        })

        // Create value
        const val = (cssProp, cssValue) => `${cssProp}:${cssValue};`
        // Create values collection
        const valCollection = (cssProp, values) => {
            let resultProps = {}
            values.forEach(valueCollection => (
                resultProps = { ...resultProps, ...valueCollection(cssProp) }
            ))
            return resultProps
        }

        // Available props
        return {
            // Block width & height
            Width: valCollection('width', [unitValues]),
            MinWidth: valCollection('min-width', [unitValues]),
            MaxWidth: valCollection('max-width', [unitValues]),
            Height: valCollection('height', [unitValues]),
            MinHeight: valCollection('min-height', [unitValues]),
            MaxHeight: valCollection('max-height', [unitValues]),
            Fill: val('width', '100%') + val('height', '100%'),
            Fullscreen: val('width', '100vw') + val('height', '100vh'),

            // Spacing: margin & padding
            Margin: valCollection('margin', [sidesUnitValues]),
            Padding: valCollection('padding', [sidesUnitValues]),

            // Background
            BgColor: valCollection('background-color', [colorValues]),
            
            // Text & font
            TextColor: valCollection('color', [colorValues]),
            TextSize: valCollection('font-size', [unitValues]),
            TextWeight: {
                100: val('font-weight', '100'),
                200: val('font-weight', '200'),
                300: val('font-weight', '300'),
                400: val('font-weight', '400'),
                500: val('font-weight', '500'),
                600: val('font-weight', '600'),
                700: val('font-weight', '700'),
                800: val('font-weight', '800'),

                Normal: val('font-weight', 'normal'),
                Bold: val('font-weight', 'bold')
            },
            TextAlign: {
                Left: val('text-align', 'left'),
                Center: val('text-align', 'center'),
                Right: val('text-align', 'right')
            },
            TextDecoration: {
                Underline: val('text-decoration', 'underline'),
                None: val('text-decoration', 'none')
            },

            // Cursor
            Cursor: {
                None: val('cursor', 'none'),
                Auto: val('cursor', 'auto'),
                Clickable: val('cursor', 'pointer'),

                Custom: (url, x, y) => val('cursor', `${url} ${x} ${y}, auto`),
            },

            // Text selection
            Selection: {
                None: val('user-select', 'none')
            },

            // Animation
            Transition: {
                None: val('transition', 'none'),
                Smooth: val('transition', '.3s ease-in-out')
            },

            // Display
            As: {
                Block: val('display', 'block'),
                Inline: val('display', 'inline')
            },

            // Flex
            AutoContent: val('display', 'flex'),
            Direction: {
                Horizontal: val('flex-direction', 'row'),
                Vertical: val('flex-direction', 'column'),
            },
            Align: {
                Start: val('align-items', 'flex-start'),
                Center: val('align-items', 'center'),
                End: val('align-items', 'flex-end')
            },
            Justify: {
                Start: val('justify-content', 'flex-start'),
                Center: val('justify-content', 'center'),
                End: val('justify-content', 'flex-end')
            },
            SelfCentered: val('align-self', 'center') + val('justify-self', 'center') + val('margin', 'auto'),
            SelfAlign: {
                Start: val('align-self', 'flex-start'),
                Center: val('align-self', 'center'),
                End: val('align-self', 'flex-end')
            },
            SelfJustify: {
                Start: val('justify-self', 'flex-start'),
                Center: val('justify-self', 'center'),
                End: val('justify-self', 'flex-end')
            },

            // Gap
            Gap: valCollection('gap', [unitValues]),

            //Border
            Border: {
                Top: valCollection('border-top-width', [unitValues]),
                Bottom: valCollection('border-bottom-width', [unitValues]),
                Left: valCollection('border-left-width', [unitValues]),
                Right: valCollection('border-right-width', [unitValues]),
                All: valCollection('border-width', [unitValues]),

                Color: valCollection('border-color', [colorValues]),
                Type: valCollection('border-style', [borderStyleValues]),

                None: val('border', 'none')
            },
            Rounding: {
                ...unitValues('border-radius'),
                
                Default: val('border-radius', 'var(--border-radius)')
            },

            // Outline
            Outline: {
                Top: valCollection('outline-top-width', [unitValues]),
                Bottom: valCollection('outline-bottom-width', [unitValues]),
                Left: valCollection('outline-left-width', [unitValues]),
                Right: valCollection('outline-right-width', [unitValues]),
                All: valCollection('outline-width', [unitValues]),

                Color: valCollection('outline-color', [colorValues]),
                Type: valCollection('outline-style', [borderStyleValues]),

                None: val('outline', 'none')
            },

            // Other
            // Custom CSS prop
            Custom: (propName, propValue) => val(propName, propValue),
            // Force style prop
            Force: (prop) => prop.replace(';', ' !important ;')
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
        let css = ''

        const props = this.propsCallback(VegtexStyle.Style())
        // One state(base) style
        if(Array.isArray(props)) {
            // If not empty
            if(props.length > 0) {
                css += `${selector} {`
                props.forEach(propCss => {
                    css += propCss
                })
                css += `}`
            }
        }
        // Multiple states style
        else if(typeof props === 'object') {
            // Loop all states
            Object.keys(props).forEach(stateName => {
                let finalSelector = `${selector}${stateName.replaceAll(':host', '')}`
    
                // If not empty
                if(props[stateName].length > 0) {
                    css += `${finalSelector} {`
                    props[stateName].forEach(propCss => {
                        css += propCss
                    })
                    css += `}`
                }
            })
        }
        // Unknown mode
        else {
            throw new Error(`Invalid style callback value (${props})`)
        }

        return css
    }

    /**
    * Generate style attribute for inline using
    *
    * @this    {VegtexStyle}
    * @returns {String} Generated CSS
    */
    inline() {
        let css = ''

        const states = this.propsCallback(VegtexStyle.Style())
        Object.keys(states).forEach(stateName => {
            // Is host state
            if(stateName.trim() == ':host') {
                // If not empty
                if(states[stateName].length > 0) {
                    states[stateName].forEach(propCss => {
                        css += propCss
                    })
                }
            }
            /*
                // Additional
                for(const propName of Object.keys(this.additionalProps)) {
                    rulesCss += `\n    ${propName.replaceAll('_','-')}: ${this.additionalProps[propName]};`
                }
            */
        })

        return css
    }
}

VegtexStyle.prototype.toString = function() {
    return this.inline()
}