/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Tue 25 Sep 2018 02:42:40 PM CEST
  *       MODIFIED:
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { hello } from './indexModule.js';

const div: HTMLElement = document.createElement('div');
div.textContent = hello();
document.body.appendChild(div);
console.log('coucou');

console.log('hello', hello());
