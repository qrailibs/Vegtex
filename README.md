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

Example:
```js
import { vegtex, VegtexComponent } from 'vegtex'

var myComponent = new VegtexComponent('my-component')
myComponent.template = function() {
   // template will be rendered inside tag
   this.inside = true

   return `
      <h1>This is my component!</h1>
      <!-- Initial content inside tag-->
      <p>${this.inner}</p>
   `
} 
```
```html
<html>
    <head>
        <title>Vegtex Single-Page Application</title>
    </head>
    <body>
        <my-component>
            Hello :) 
        </my-component>
        
        <script src="./js/index.js"></script>
    </body>
</html>
```
When page is loaded and Vegtex rendering will be finished, page will look like this:
```html
<html>
    <head>
        <title>Vegtex Single-Page Application</title>
    </head>
    <body>
        <my-component>
            <h1>This is my component!</h1>
            <!-- Initial content inside tag-->
            <p>Hello :)</p>
        </my-component>
        
        <script src="./js/index.js"></script>
    </body>
</html>
```
