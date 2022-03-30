import VegtexComponent from "../VegtexComponent"
import VegtexGlobals from "../VegtexGlobals"

export function createRouter(routes, options) {
    VegtexGlobals.set('router', {
        mode: options?.mode || 'multipage'
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
            click() {
                if(VegtexGlobals.exists('router')) {
                    const router = VegtexGlobals.get('router')

                    // SPA mode
                    if(router.mode === 'spa') {
                        const routerView = VegtexGlobals.get('routerView')
                        routerView.state.page = this.state.to
                    }
                    // Multipage mode
                    else if(router.mode === 'multipage')
                        window.location = `${window.location.pathname}?page=${this.state.to}`
                }
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