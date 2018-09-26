/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED:
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { SquareValues } from './SquareValues.js';

// See:
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
// And https://developer.mozilla.org/en-US/docs/Web/API/URL
const parsedUrl: URL = new URL(document.location.href);
console.log('URL query param gamemode: ' +
  parsedUrl.searchParams.get('gamemode'));

const gridColumnLength: number = 7;
const gridRowLength: number = 6;

const grid: SquareValues[][] = new Array(gridColumnLength);

for (let columnIndex: number = 0 ;
        columnIndex < gridColumnLength ;
        columnIndex++) {
  grid[columnIndex] = new Array(gridRowLength);
  for (let rowIndex: number = 0 ; rowIndex < gridRowLength ; rowIndex++) {
    grid[columnIndex][rowIndex] = 0;
  }
}

for (let columnIndex: number = 0 ;
  columnIndex < gridColumnLength ;
  columnIndex++) {
  const column: HTMLElement = document.createElement('div');
  column.classList.add('column');
  for (let rowIndex: number = 0 ; rowIndex < gridRowLength ; rowIndex++) {
    console.log(grid[columnIndex][rowIndex]);
    const square: HTMLElement = document.createElement('div');
    square.textContent = SquareValues[grid[columnIndex][rowIndex]];
    square.classList.add('square');
    column.appendChild(square);
  }
  document.body.appendChild(column);
}

// vim: ts=2 sw=2 et:
