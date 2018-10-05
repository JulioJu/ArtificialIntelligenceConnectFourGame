//Load common code that includes config, then load the app logic for this page.
requirejs(['./common'], function (common) {
    requirejs(['javascript/connect-four-game/connect-four-game']);
});
