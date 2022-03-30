import VegtexComponent from "../VegtexComponent";

export const Item = new VegtexComponent('vg-item', {
    events: {
        click: (instance, e) => {
            switch(instance.parentNode.tagName.toLowerCase()) {
                case 'vg-list':
                    instance.handleAsListItem(instance, e)
                break;
                case 'vg-navbar':
                    instance.handleAsNavItem(instance, e)
                break;
                case 'vg-sidebar':
                    instance.handleAsSidebarItem(instance, e)
                break;
            }
        }
    },
    locals: {
        handleAsListItem: (instance, e) => {

        },
        handleAsNavItem: (instance, e) => {

        },
        handleAsSidebarItem: (instance, e) => {
            let navigateTo = e.target.getAttribute('navigate')
            
            if(navigateTo) {
                //TODO: navigate
                console.log(navigateTo)
            }
        }
    }
})