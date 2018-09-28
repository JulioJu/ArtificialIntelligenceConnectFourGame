/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED: Fri 28 Sep 2018 11:51:31 AM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH } from './constants.js';
import { Square } from './Square.js';
import { SquareValues } from './SquareValues.js';
import { IsCurrentGamerWin } from './isCurrentGamerWin.js';

let currentGamer: SquareValues = SquareValues.GAMER_RED;

// Should not be an arrow function, because `this'
// doesn't exists in Arrow function
const squareOnClick:
    (this: Square, grid: Square[][]) => void
    = function(this: Square, grid: Square[][]): void {
  console.log('Square clicked: ', this);
  let squareAdded: Square | undefined;
  for (let rowIndex: number = GRID_ROW_LENGTH - 1 ;
          rowIndex >= 0 ;
          rowIndex--) {
    const square: Square = grid[this.columnIndex][rowIndex];
    if (square.squareValue === SquareValues.EMPTY_SQUARE) {
      squareAdded = square;
      break;
    }
  }
  if (squareAdded) {
    console.log('First Square empty on the bottom of the column clicked: ',
      squareAdded);
    const squareAddedHTMLElement: HTMLElement =
      squareAdded.squareHTMLElement;
    // tslint:disable-next-line:switch-default
    switch (currentGamer) {
      case SquareValues.GAMER_RED:
        squareAdded.squareValue = SquareValues.GAMER_RED;
        squareAddedHTMLElement.classList.remove('square_empty');
        squareAddedHTMLElement.classList.add('square_gamer_red');
        squareAddedHTMLElement.textContent =
          SquareValues[SquareValues.GAMER_RED];
        if (IsCurrentGamerWin(currentGamer, grid, squareAdded)) {
          alert(SquareValues[currentGamer] + ' win!!!');
        }
        currentGamer = SquareValues.GAMER_YELLOW;
        console.log('red');
        break;
      case SquareValues.GAMER_YELLOW:
        squareAdded.squareValue = SquareValues.GAMER_YELLOW;
        squareAddedHTMLElement.classList.remove('square_empty');
        squareAddedHTMLElement.classList.add('square_gamer_yellow');
        squareAddedHTMLElement.textContent =
          SquareValues[SquareValues.GAMER_YELLOW];
        if (IsCurrentGamerWin(currentGamer, grid, squareAdded)) {
          alert(SquareValues[currentGamer] + ' win!!!');
        }
        currentGamer = SquareValues.GAMER_RED;
        console.log('yellow');
    }
  } else {
    console.log('No Square empty on the column: ', this.columnIndex);
  }
};

export const main: () => void = (): void => {
  // See:
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
  // And https://developer.mozilla.org/en-US/docs/Web/API/URL
  const parsedUrl: URL = new URL(document.location.href);
  console.log('URL query param gamemode: ',
    parsedUrl.searchParams.get('gamemode'));

  const grid: Square[][] = new Array(GRID_COLUMN_LENGTH);

  for (let columnIndex: number = 0 ;
          columnIndex < GRID_COLUMN_LENGTH ;
          columnIndex++) {

    grid[columnIndex] = new Array(GRID_ROW_LENGTH);

    const columnHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.classList.add('column');

    for (let rowIndex: number = 0 ; rowIndex < GRID_ROW_LENGTH ; rowIndex++) {

      const squareHTMLElement: HTMLElement = document.createElement('div');

      const square: Square = new Square(columnIndex, rowIndex,
          SquareValues.EMPTY_SQUARE, squareHTMLElement);
      grid[columnIndex][rowIndex] = square;

      squareHTMLElement.textContent = SquareValues[grid[columnIndex][rowIndex]
        .squareValue];
      squareHTMLElement.classList.add('square');
      squareHTMLElement.classList.add('square_empty');
      squareHTMLElement.addEventListener('click', (e: Event) => {
        e.preventDefault();
        squareOnClick.call(square, grid);
      }, false);

      columnHTMLElement.appendChild(squareHTMLElement);

    }

    document.body.appendChild(columnHTMLElement);

  }

};

// vim: ts=2 sw=2 et:
