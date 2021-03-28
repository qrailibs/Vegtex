//CSS Framework
import '../css/vegtex.scss'

//js
const VegtexComponent = require('./VegtexComponent')
const VegtexDefiner = require('./VegtexDefiner')

VegtexDefiner.defineComponent(
    new VegtexComponent('sidebar',{},{},{color:'red'}, '{inner} :)')
)