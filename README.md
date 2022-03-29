# About
Vegtex - HTML Framework for easier and faster development of beautiful websites.

# Installation
Install via npm:
```
npm i vegtex -D
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

new VegtexComponent('my-counter', {
    template() {
        return `
            <p>Clicked ${this.x} times</p>
        `
    },
    style(Style) {
        this.addHover(function() {
            return {
                background: this.color9
            }
        })

        return {
            ':host': [
                // Background & Text color
                Style.BgColor.color10,
                Style.TextColor.color0,
                
                // Content auto-flow
                Style.AutoContent,
                Style.Align.Center,
                Style.Justify.Center,
                
                // Margin
                Style.Margin.Top.px(25),
                
                // Cursor, text selection
                Style.Cursor.Clickable,
                Style.Selection.None,
                
                // Border rounding
                Style.Rounding.Default,
                
                // Smooth transitions
                Style.Transition.Smooth
            ],
            ':hover': [
                Style.Force(Style.BgColor.color9),
            ]
        }
    },
    events: {
        click(instance, e) {
            instance.$locals.x++
            console.log(instance.$locals.x)
        }
    },

    locals: {
        x: 0
    },
})
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
            <vg-item navigate="/dashboard">Dashboard</vg-item>
            <vg-item navigate="/messages">Messages</vg-item>
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
[Russian Documentation](https://proxymal.ru/view/vegtex)
