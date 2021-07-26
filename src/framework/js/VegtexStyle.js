import VegtexStyleRule from './VegtexStyleRule.js'

export default class VegtexStyle {
    /**
    * Create CSS style
    *
    * @constructor
    * @this  {VegtexStyle}
    * @param {Array.<VegtexStyleRule>} rules CSS Rules.
    */
    constructor(rules = []) {
        this.rules = rules
    }

    /**
    * Generate CSS for this style
    *
    * @this    {VegtexStyle}
    * @returns {String} Generated CSS
    */
    get css() {
        var finalCss = ''

        //add every rule
        this.rules.forEach(rule => {
            finalCss += `
            ${rule.selector} {
                ${rule.css}
            }
            `
        });

        return finalCss
    }
}