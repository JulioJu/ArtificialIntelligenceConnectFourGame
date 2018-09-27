# How To

* To use it:
    1. For TypeScript compiler: `./node_modules/.bin/tsc`
        (watch mode could be configured in ./tsconfig.json)
    2. Launch the app:
        * EITHER (for Browsersync)
            ```
            pushd  app && ../node_modules/.bin/browser-sync start --server --index ./index.html --files ./ & popd
            ```
            * `browser-sync` should be launch in `app/` because app is our root folder.
            * Thanks BrowserSync, each modification saved
                automatically reload the app in the Browser :-).
        * OR `firefox ./app/index.js`
        * Note: In Firefox, we can debug the TypeScript files ! So cool ! ^^
                We can also use break points… Soooo cooool ;-).

* This app use Modules. Therefore, we must have a recent Browser
        (e.g Firefox > 60).

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

* To retrieve url parm see:
    * https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
    * And https://developer.mozilla.org/en-US/docs/Web/API/URL

### Notes
* Form in index.ts is not validated before it is submits. As code is
    client-side, and I only use radio buttons with a default check,
    I believe it's not useful to process validation. If the user
    want break the code with inspector or by change source code, it could ! ;-).
    * Otherwise in connect-four-game.ts it could be interesting to validate
        the URL.

* In Firefox, when dev tools are open, the size of the `window` element
    is has a hight a little bit taller than the real hight of the screen.

<!--
vim: ts=4 sw=4 et:
-->
