import vegtex from '../framework/js/vegtex'

vegtex.use('dark', 'azure')

new vegtex.VegtexScope('form', {
    error: { ref: 'err' },
    name: { ref: 'name' },
    
    submit() {
        if (this.name.value.trim().length <= 0)
            this.error.innerText = 'Please enter name'
        else
            this.error.innerText = ''
    }
})