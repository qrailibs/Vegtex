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

## For SPA (Single Page Application)
Vegtex Framework has a lot of useful components for your **SPA**.

Example SPA page with Vegtex:
```html
<html>
    <head>
        <title>Vegtex Single-Page Application</title>
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
*TODO*

# Documentation
*TODO*
