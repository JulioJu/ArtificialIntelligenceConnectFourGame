# Usage
* To use it:
    1. Compile with the TypeScript compiler: `./node_modules/.bin/tsc`
    2. Download require.js (see https://requirejs.org/docs/start.html) into
        `./app/requirejs/lib/`
    2. Launch the app:
        * EITHER (for Browsersync)
            ```
            pushd  app && ../node_modules/.bin/browser-sync start --server --index ./index.html --files ./ & popd
            ```
            * `browser-sync` should be launch in `app/` because app is our root folder.
            * Thanks BrowserSync, each modification saved
                automatically reload the app in the Browser :-).
            * We could also symply use `yarn browsersync`
                or `npm browsersync`.
        * OR `firefox ./app/index.html` (or click on the file)

### Google Chrome issues with history

* Note before read this section: finally it seems our app does not need
    `history.pushState`. `document.location.assign(url);` seems to be
    enough on Chromium 69, Firefox 62 and Waterfox 56.

* Chrome does not support history feature when the app is launched without
    servers.
    * Interesting links:
        * https://bugs.chromium.org/p/chromium/issues/detail?id=301210 ()
        * https://stackoverflow.com/questions/32508198/systrace-error-uncaught-securityerror-failed-to-execute-pushstate-on-histor
        * https://stackoverflow.com/questions/8456538/origin-null-is-not-allowed-by-access-control-allow-origin/13262673#13262673
    * In this app, when the functionality is needed,
        this app display a message in the Browser about this issue without
        crash.
    * To have this functionality in Chrome, you could use Browsersync or another
        server like https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
    * Firefox works perfect !! :-). The easier solution is simply: use Firefox.

* If we need `history.pushState()`, use following code:
    try {
      history.pushState(undefined, undefined, url);
    } catch (e) {
      const messageError: string = 'You\'re browser does not support history' +
        ' functionnality for local website' +
        '(e.g. you can\'t use Back button to come back ' +
        'to the current page). If your are interested by this ' +
        'functionnality, use Firefox or use a local server' +
        '(e.g Browsersync). See README.md for more informations.';
      console.error(messageError);
      console.error(e);
      alert (messageError);
    }

### Note about es6 Modules in Browsers (deprecated)

***THIS SECTION IS DEPRECATED*** , now the app use require.js and no longer
    es6 modules in compiled code.

* This app use Modules. Therefore, we must have a recent Browser
        (e.g ***Firefox >= 60***, and ***Firefox >= 61*** to the support by the
        DevTools).

* We can't launch the app with `chromium ./app/index.html`, otherwise we have
    error "`Origin null is not allowed by Access-Control-Allow-Origin`".
    We must use a server with `chromium`, like `browser-sync`.
* With Firefox, we have not this error, that's why we could use command
    `firefox ./app/index.html` to launch the app. But, in this case,
    `javascript` files must be under the folder that contains `index.html`.
        If the javascript file is in a parent folder
        (e.g. in index.html : `<script type="module" src="../index.js" />`)
        we have the followings errors:
            * "`Cross-Origin Request
                Blocked: The Same Origin Policy disallows reading the remote
                resource at
                file:///home/julioju/DCISS/IA/ArtificialIntelligenceConnectFour/index.js.
                (Reason: CORS request not http).`" with a link to
                https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp
            * and "`Module source URI is not allowed in this document:
                “file:///home/julioju/DCISS/IA/ArtificialIntelligenceConnectFour/index.js”`"

* We could also use scripts defined in `./package.json`.

* In Vim, with the plugin `ALE`, do not forget that linter lint only one files…
    Therefore, with Vim it's cool to run `yarn compileAndLint` for development.

* To use under Chrome or for `Firefox < 60` without server
    simply compile with `tsc` with options `--outFile whatever.js` and
    `--module AMD`. JQuery is compiled with AMD modules and `require.js`.
    Using a fat compiler chain with Gulp and WebPack isn't interesting.

* In Firefox, when page is loaded, we must close then open again
    DevTools to see TypeScript files in the console and Debugger. See also:
    https://bugzilla.mozilla.org/show_bug.cgi?id=1443247:

* Tested also with:
    `https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework`
    as for resolve AJAX errors with Chrome
    (https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework ). Without reslults.

## Cool functionality

* You could see that when you click several time very quickly with your mouse
    you add each time a new checker ! Contrary to before, checkers that are
    still animated when a new checker is added don't jump ! It's because
    each checker has it's own `@keyframes`.
    * Note that each checker start to
        move on the top of the screen !!! Even if you resize your Browser
        window !!! And this behaviour works for each row !!!!!

# Notes on code developed
* To retrieve url parm see:
    * https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
    * And https://developer.mozilla.org/en-US/docs/Web/API/URL

* Form in index.ts is not validated before it is submits. As code is
    client-side, and I only use radio buttons with a default check,
    I believe it's not useful to process validation. If the user
    want break the code with inspector or by change source code, it could ! ;-).
    * Otherwise in connect-four-game.ts it could be interesting to validate
        the URL.

* In Firefox, when dev tools are open, the size of the `window` element
    is has a hight a little bit taller than the real hight of the screen.

* In page `connect-four-game.html`, when we see headers Developpers tools,
    each time we click to add a checker, a new tag style is created
    that correspond to the checker added. In Firefox 52, style tags
    are not displayed with cool `\n`, little bit hard to read if all definitions
    are in the same tag. That's why I create a tag per checker added.

## Manipulate CSS Object Model (CSSOM)

* To well understand CSS Object Model see:
    * https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Using_dynamic_styling_information
    * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
    * https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
    * https://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript
        (we could give an id to a Stylesheet ^^. The StyleSheet interface
        has also the title property.).
        (warning about attribute "title":
        https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets )
    * https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
    * In the futur, it should be better to use CSS Typed Object Model:
        * https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model#CSS_Typed_Object_Model
        * https://developers.google.com/web/updates/2018/03/cssom
    * Information about CSSOM
        https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model

* I believe it's better to attach css generated by JavaScript to the tag
    because styles under the tag `<style>` in the HTML are not well formated
    into Firefox 62.  Furthermore, JQuery has choose this behaviour.

* For:
    ```
        const styleEl: HTMLStyleElement = document.createElement('style');
        document.head.appendChild(styleEl);
    ```
    * It's not interesting to use CSS Object Model API:
        ```
            const styleSheet: CSSStyleSheet = (styleEl.sheet as CSSStyleSheet);
            styleSheet.insertRule('...', styleSheet.cssRules.length);
        ```
        because we can't see the modification in the DOM, it's only a
        modification of "the internal representation of the document.".
        (see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Using_dynamic_styling_information
        and https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule .)
    * My personal opinion is it's a little better to use directly:
    ```
        styleSheet.innerHTML = '...'
    ```
    even if it modify the DOM (maybe more cost consuming?).  Because rightly, we
    could see the modification in the DOM, and not only in the computed style
    (https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle ).
    Not that `at-rules` can't be seen in computed style.
    * I've tested with Chromium and Firefox 62.
    * In this project ***I've used pure CSSOM*** (no `innerHTML` property)
        because as it we could understand exactly what is CSSRules and
        CSSKeyframesRule. StyleSheet generated is logged at startup, then each
        new keyframes created is log at each click.
    * Remember this advise from Mozilla:
        ***"it may be better practice to dynamically change classes, so style
        information can be kept in genuine stylesheets and avoid adding extra
        elements to the DOM"***. (from
        https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule )
        * But in practice it's hard to retrieve rules, as StyleSheet.cssRules
            is an array. Named `keyframes` are easy to retrieve,
            because they have a name, but not classical `Rulesets`.
    * It's not advise to change external css stylesheet cause of possible
        SecurityError
        https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet ***("In
        some browsers, if a stylesheet is loaded from a different domain,
        calling cssRules results in SecurityError.")***
        Therefore in this case redefine css class in a local css file or in
        a tag `<style />` and comment it to say how it should done.
* Actually CSS rule (like CSSKeyframesRule /CSSKeyframsRule) can't be
    instantiated. See http://tabatkins.github.io/specs/construct-stylesheets/
    referenced by
    https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet#Notes, or
    https://www.w3.org/TR/css-animations-1/#interface-cssrule.
    But they could be retrieve from StyleSheet and modify.
    https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
    (link already cited).

### Animation (keyframes):

* https://www.w3schools.com/css/css3_animations.asp (page advised in the website
    angular.io at https://angular.io/api/animations/keyframes)
* https://www.w3.org/blog/CSS/2017/12/20/how-should-we-resolve-percentage-margins-and-padding-on-grid-and-flex-items/
* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations

* To manipulate the CSSKeyframesRule object see examples at
    * https://codepen.io/estelle/pen/dogmoG
    * or https://css-tricks.com/controlling-css-animations-transitions-javascript/
    * Better: read `./app/typescript/connect-four-game/square-on-click.ts`
* For AnimationEvent see
    https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
    And an example at:
    https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips
* To describe css Rules in JSON read:

* We can't restart an animation simply: see
    https://css-tricks.com/restart-css-animation/

### CSS colors / images

* https://cssgradientbutton.com/

* http://angrytools.com/gradient/

## Conventions
    * In javascript / typescript folders, files that have the same name that a html
        file are directly included to the html file
        e.g. in `./app/connect-four-game.html`:
        ```
        <script type="module" >
        import { main } from
        './javascript/connect-four-game/connect-four-game.js';
        main();
        </script>
        ```
* In javascript / typescript folders, files that start by a lower case
    contains either:
    * `Arrows functions` (function that could not be used as constructor). It's
        because they could be seen as `static class` in Java-like languages.
    * `Object initializer` (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
        * Note: in our case, an object initialized with an object
            initializer should be seen as a SINGLETON.
* In javascript / typescript folders, file that start by an upper contains
    either:
        * TypeScript Enum
        * es6 Class
        * es5 functions that are used as constructor (constructor function)
            (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    * Notes, object could be instantiated in different ways, but only
        instantiation with Object initializer or with Constructor are advise:
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
        https://tylermcginnis.com/object-creation-in-javascript-functional-instantiation-vs-prototypal-instantiation-vs-pseudo-e9287b6bbb32/
        https://medium.com/dailyjs/instantiation-patterns-in-javascript-8fdcf69e8f9b

* The name of all exported functions start by an upper case letter because
    in Java-like languages they could be seen as a `static class`.
* The name of exported objects instantiated with
    an Object initializer start by a lower case because in Java-like languages
    they could be seen as an instantiated object. An example is
    `./app/typescript/connect-four-game/store-singleton.ts`.

# TODO (not important for the teacher)
* We must command all exported methods and remove in `./tslint.yaml` the rule
    `completed-docs: false`

* I don't know why when we remove rule `greyscale()` in
    `./app/connect-four-game.css` it doesn't work.

* If we want improve column background, we must work with SVG.

* To improve animation,
    * we could simply use css function
    `cubic-bezier()`.
    * Or maybe Canvas or WebGL
    (see https://developer.mozilla.org/en-US/docs/Web/Guide/Graphics )
    * Or maybe for the weak people: Velocity.
    * Read https://developers.google.com/web/fundamentals/design-and-ux/animations/css-vs-javascript

* Test the compilated version on IE 11.

# Credits

* © JulioJu (https://github.com/JulioJu). Licence MIT.
* ./app/image/Connect_Four.gif was uploaded from Wikipedia:
    * File:Connect Four.gif. (2016, February 11).
        Wikimedia Commons, the free media repository.
        Retrieved 12:46, October 6, 2018 from
        https://commons.wikimedia.org/w/index.php?title=File:Connect_Four.gif&oldid=187353232.
    * Licensed under the Creative Commons Attribution-Share Alike 3.0 Unported

* All parts of this application is original. Some parts are
    inspired by documentation found on Internet. This pages are referenced in
    the code, but no copy and past was done.


<!--
vim: ts=4 sw=4 et:
-->
