"use strict";
var message='You\'re Browser is outdated or doesn\'t ' +
'support a recent version of JavaScript. Please use ' +
'Firefox Desktop > 60'

var div = document.createElement('div');
div.textContent = message;
div.style.backgroundColor = 'red';

var strong = document.body.appendChild(document
    .createElement('strong'));
strong.appendChild(div);

alert(message);
