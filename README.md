# About
Vegtex - HTML Framework for easier and faster development of beautiful websites.

# Installation
Install via npm:
```
npm i vegtex -D
```

# How to use
Vegtex is modern JS, HTML, CSS Framework that adds alot of 
features, there is guide how to use that features.

## 1. SPA (Single Page Application)
Framework adds some new useful **SPA** tags to your HTML pages, 
that you can use to easily create SPA.

Example SPA page with Vegtex:
```html
<html>
    <head>
        <title>Vegtex Single-Page Application</title>
    </head>
    <body spa>
        <vg-sidebar pos-left size-lg>
            <item>Sidebar Item</item>
            <item>Sidebar Item</item>
        </vg-sidebar>

        <vg-page route="main">
           <h1>Some page content :)</h1>
        </vg-page>

        <script src="./js/index.js"></script>
    </body>
</html>
```

## 2. Custom Components
Vegtex allows you to define your own components to HTML.

**WIP**
