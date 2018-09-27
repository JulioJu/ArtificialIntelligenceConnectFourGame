/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED: Thu 27 Sep 2018 01:40:55 PM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { Square } from './Square.js';
import { SquareValues } from './SquareValues.js';

// const squareOnClick: () => void =
//   (): void => {
//     console.log(row);
//   };

// Should not be an arrow function, because `this'
// doesn't exists in Arrow function
const squareOnClick: () => void = function(this: Square): void {
  console.log(this);
};

export const main: () => void = (): void => {
  // See:
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
  // And https://developer.mozilla.org/en-US/docs/Web/API/URL
  const parsedUrl: URL = new URL(document.location.href);
  console.log('URL query param gamemode: ' +
    parsedUrl.searchParams.get('gamemode'));

  const gridColumnLength: number = 7;
  const gridRowLength: number = 6;

  const grid: Square[][] = new Array(gridColumnLength);

  for (let columnIndex: number = 0 ;
          columnIndex < gridColumnLength ;
          columnIndex++) {
    grid[columnIndex] = new Array(gridRowLength);
    for (let rowIndex: number = 0 ; rowIndex < gridRowLength ; rowIndex++) {
      grid[columnIndex][rowIndex] = new Square(columnIndex, rowIndex,
          SquareValues.EMPTY_SQUARE);
    }
  }

  for (let columnIndex: number = 0 ;
          columnIndex < gridColumnLength ;
          columnIndex++) {
    const columnHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.classList.add('column');
    for (let rowIndex: number = 0 ; rowIndex < gridRowLength ; rowIndex++) {
      const square: Square = grid[columnIndex][rowIndex];
      console.log(square);
      const squareHTMLElement: HTMLElement = document.createElement('div');
      squareHTMLElement.textContent = SquareValues[grid[columnIndex][rowIndex]
        .squareValue];
      squareHTMLElement.classList.add('square');
      squareHTMLElement.addEventListener('click', (e: Event) => {
        e.preventDefault();
        squareOnClick.call(square);
      }, false);
      columnHTMLElement.appendChild(squareHTMLElement);
    }
    document.body.appendChild(columnHTMLElement);
  }
};

// vim: ts=2 sw=2 et:
