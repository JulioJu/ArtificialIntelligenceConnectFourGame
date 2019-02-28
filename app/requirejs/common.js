//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
    // folder "." ==== folder where the html file is
    baseUrl: './javascript',
    paths: {
        "javascript/index": './index',
        "javascript/connect-four-game": './connect-four-game'
    }
});
