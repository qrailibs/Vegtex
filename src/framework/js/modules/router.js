import VegtexComponent from "../VegtexComponent"
import VegtexGlobals from "../VegtexGlobals"

export function createRouter(routes, options) {
    // Check arguments
    if(!routes)
        throw new Error('Routes was not passed')

    // Set global router object
    VegtexGlobals.set('router', {
        mode: options?.mode || 'multipage',

        current: null,
        middleware: options?.middleware,

        navigate(page) {
            // SPA mode
            if(this.mode === 'spa') {
                this.current = page
                
                // Set page in view
                if(VegtexGlobals.exists('routerView'))
                    VegtexGlobals.get('routerView').state.page = page
            }
            // Multipage mode
            else if(this.mode === 'multipage')
                window.location = `${window.location.pathname}?page=${page}`

            // Call middleware (page, navigate)
            this.middleware?.(page, this.navigate)
        }
    })

    // Make <router-view>
    new VegtexComponent('router-view', {
        state: () => ({
            // Current page name
            page: new URL(window.location.href).searchParams.get('page') || 'index',
            // All available pages (routes)
            pages: routes
        }),
        template() {
            const getRouteHTML = (route) => {
                if(typeof route === 'string')
                    return route
                else if(route instanceof VegtexComponent)
                    return route.use(null, {})
            }

            let finalHTML = ''

            // Route found
            if(this.state.pages[this.state.page])
                finalHTML = getRouteHTML(this.state.pages[this.state.page])
            // Route not found && Has 404 route
            else if(this.state.pages['404'])
                finalHTML = getRouteHTML(this.state.pages['404'])
            // Route not found (Dont has 404 route)
            else
                finalHTML = `<p>Error: page '${this.state.page}' not found, 404 page was not defined.</p>`

            // Return HTML of current page
            return finalHTML
        },
        style: options?.viewStyle,
        events: {
            __added__() {
                // Set current router page
                if(VegtexGlobals.exists('router'))
                    VegtexGlobals.get('router').current = this.state.page

                // Set global router-view
                if(!VegtexGlobals.exists('routerView'))
                    VegtexGlobals.set('routerView', this)
                else
                    throw new Error('Page cannot contain multiple router views(<router-view>)')
            }
        }
    })

    // Make <router-link>
    new VegtexComponent('router-link', {
        state() {
            return {
                to: this.getAttribute('to')
            }
        },
        events: {
            __added__() {
                // If this link is to current page
                if(this.state.to == VegtexGlobals.get('router')?.current)
                    this.setAttribute('active', '')
            },
            click() {
                if(VegtexGlobals.exists('router'))
                    VegtexGlobals.get('router').navigate(this.state.to)
                else
                    throw new Error('Failed to navigate, router was not defined')
            },
        },
        style: options?.linkStyle || ((Style) => ({
            ':host': [
                Style.Width.min,

                Style.TextColor.color0,

                Style.Cursor.Clickable,
                Style.Transition.Smooth
            ],
            ':hover': [
                Style.TextDecoration.Underline
            ]
        }))
    })
}

//TODO: class VegtexRouter instead of createRouter()
/*
export default class VegtexRouter {
    constructor(routes, options) {

    }
}
*/