# Usage
* To use it:
    1. For TypeScript compiler: `./node_modules/.bin/tsc`
    2. Launch the app:
        * EITHER (for Browsersync)
            ```
            pushd  app && ../node_modules/.bin/browser-sync start --server --index ./index.html --files ./ & popd
            ```
            * `browser-sync` should be launch in `app/` because app is our root folder.
            * Thanks BrowserSync, each modification saved
                automatically reload the app in the Browser :-).
        * OR `firefox ./app/index.html` (or click on the file)
        * Note: In Firefox, we can debug the TypeScript files ! So cool ! ^^
                We can also use break points… Soooo cooool ;-).

* This app use Modules. Therefore, we must have a recent Browser
        (e.g ***Firefox > 60***).

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

## Documentation animation:

* https://www.w3schools.com/css/css3_animations.asp (page advised in the website
    angular.io at https://angular.io/api/animations/keyframes)
* https://www.w3.org/blog/CSS/2017/12/20/how-should-we-resolve-percentage-margins-and-padding-on-grid-and-flex-items/
* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations

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
* In javascript / typescript folders, files that start by a lower
    case contains only `Arrows functions`
    (function that could not be used as constructor).

* In javascript / typescript folders, file that start by an upper case contains
    TypeScript Enum , es6 Class or es5 functions that are used as constructor.
    * Notes, object could be instantiated in different ways, but only
        instantiation with Constructor are advise:
        https://tylermcginnis.com/object-creation-in-javascript-functional-instantiation-vs-prototypal-instantiation-vs-pseudo-e9287b6bbb32/
        https://medium.com/dailyjs/instantiation-patterns-in-javascript-8fdcf69e8f9b

* All exported functions start by an upper case letter.

# TODO
* We must command all exported methods and remove in `./tslint.yaml` the rule
    `completed-docs: false`

<!--
vim: ts=4 sw=4 et:
-->
