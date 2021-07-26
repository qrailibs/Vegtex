export default class VegtexStyleRule {
    /**
    * Create CSS style rule
    *
    * @constructor
    * @this  {VegtexStyleRule}
    * @param {String} selector - CSS Selector
    * @param {Object} props - CSS Properties
    */
    constructor(selector, props) {
        this.selector = selector
        this.props = props
    }

    /**
    * Generate CSS for this rule
    *
    * @this    {VegtexStyleRule}
    * @returns {String} Generated CSS
    */
    get css() {
        var ruleCss = ''
        //add every rule
        Object.keys(rule.props).forEach(propName => {
            var propValue = rule.props[propName]
            ruleCss += `${propName}:${propValue};`
        })

        return `
        ${this.selector} {
            ${ruleCss}
        }
        `
    }
}