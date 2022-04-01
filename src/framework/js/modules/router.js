import VegtexComponent from "../VegtexComponent"
import VegtexGlobals from "../VegtexGlobals"

export function createRouter(routes, options) {
    VegtexGlobals.set('router', {
        mode: options?.mode || 'multipage',

        current: null,
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
        }
    })

    new VegtexComponent('router-view', {
        state: () => ({
            // Current page name
            page: new URL(window.location.href).searchParams.get('page') || 'index',
            // All available pages (routes)
            pages: routes
        }),
        template() { 
            // Return HTML of current page
            return this.state.pages[this.state.page]
                || this.state.pages['404']
                || `<p>Error: page '${this.state.page}' not found, 404 page was not defined.</p>`
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