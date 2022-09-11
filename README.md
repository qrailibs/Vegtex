# About
Vegtex - HTML Framework for easier and faster development of beautiful websites.

# Installation
Install via npm:
```
npm i vegtex@1.5.6 -D
```

# How to use
Vegtex is modern JavaScript Framework that adds alot of 
features to your web-application, there is guide how to use that features.

## Example: Counter
![Basic counter component](https://github.com/Proxymal/Vegtex/blob/main/other/vegtex-counter.gif)
```html
<my-counter></my-counter>
```
```js
import vegtex from 'vegtex'

vegtex.use('light', 'azure')

new vegtex.VegtexComponent('my-counter', {
    template() {
        return `
            <p>Clicked ${this.state.x} times</p>
        `
    },
    events: {
        click(e) {
            this.state.x++
        }
    },

    state: () => ({
        x: 0
    }),
})
```
```css
my-counter {
    background: var(--color-10);
    color: var(--color-0);

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 25px;
    margin: auto;

    cursor: pointer;
    user-select: none;

    transition: var(--transition);
}
my-counter:hover {
    background: var(--color-9);
}

```

## Example: SPA
Vegtex Framework has a lot of useful components for your **SPA**.

Example SPA page with Vegtex:
```html
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Vegtex Single-Page Application</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    </head>
    <body spa>
        <vg-sidebar pos-left size-lg>
            <router-link to="/"><vg-item>Dashboard</vg-item></router-link>
            <router-link to="/messages"><vg-item>Messages</vg-item></router-link>
        </vg-sidebar>

        <script src="./js/index.js"></script>
    </body>
</html>
```
```js
import vegtex from 'vegtex'

// vegtex.use(theme, themeAccent)
vegtex.use('light', 'azure')
```

## For MA (Mobile Application)
*Mobile components isn't done yet, but we are working to make them available!*

# Documentation
[English Documentation](https://github.com/Proxymal/Vegtex/wiki)


[Russian Mini-documentation](https://proxymal.ru/view/vegtex)
