# How To

* To use it:
    1. (for TypeScript) `./node_modules/.bin/tsc`
    2. (for Browsersync)
    ```
    cd app/
    ../node_modules/.bin/browser-sync start --server --index ./index.html
        --files *`
    ```
    * Thanks this, in WaterFox, I can debug the TypeScript files ! So cool ! ^^
        I can also use break points… Soooo cooool ;-). And files are sync :-).
    * `browser-sync` should be launch in `app/` because app is our root folder.

* I use
    https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
    * With `Chromium` without `browser-sync`, use `chromium index.html` gives
        error "`Origin null is not allowed by Access-Control-Allow-Origin`".
    * With Firefox, we have not this error.
        * We have a similar error if the
        JavaScript file is in a parent parent folder (`../index.js`).  The error
        is "`Cross-Origin Request Blocked: The Same Origin Policy disallows
        reading the remote resource at
        file:///home/julioju/DCISS/IA/ArtificialIntelligenceConnectFour/index.js.
        (Reason: CORS request not http).`" with a link to
        https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp
        and "`Module source URI is not allowed in this document:
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
