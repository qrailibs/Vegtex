//CSS Framework
import '../css/main.scss'

//js
import VegtexComponent from './VegtexComponent.js'
import VegtexDefiner from './VegtexDefiner.js'

VegtexDefiner.defineComponent(
    new VegtexComponent('sidebar',{},{},{color:'red'}, '{inner} :)')
)