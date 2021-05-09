import VegtexStyleRule from './VegtexStyleRule.js'

export default class VegtexStyle {
    constructor(rules = {}) {
        this.rules = rules
    }

    get css() {
        Object.keys(this.rules).forEach(rule => {
            
        });
    }
}