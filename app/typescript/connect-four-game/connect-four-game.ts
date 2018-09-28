/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED: Sat 29 Sep 2018 12:14:33 AM CEST
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
    (this: Square, grid: Square[][],
          htmlStylElementKeyframes: HTMLStyleElement) => void
    = function(this: Square, grid: Square[][],
          htmlStylElementKeyframes: HTMLStyleElement): void {
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
    const checkerAddedHTMLElement: HTMLElement =
      squareAdded.checkerHTMLElement;

    htmlStylElementKeyframes.innerHTML = '@keyframes slidein { ' +
      'from { margin-top: -' + (window.innerHeight -
        ((GRID_ROW_LENGTH - squareAdded.rowIndex)
         * squareAdded.checkerHTMLElement.offsetHeight) +
        squareAdded.checkerHTMLElement.offsetHeight) +
      'px; } to { margin-top: 0px; } }';

    // tslint:disable-next-line:switch-default
    switch (currentGamer) {
      case SquareValues.GAMER_RED:
        console.log('red');
        squareAdded.squareValue = SquareValues.GAMER_RED;
        checkerAddedHTMLElement.classList.remove('checker_empty');
        checkerAddedHTMLElement.classList.add('checker_red');
        if (IsCurrentGamerWin(currentGamer, grid, squareAdded)) {
          alert(SquareValues[currentGamer] + ' win!!!');
        }

        currentGamer = SquareValues.GAMER_YELLOW;
        document.body.classList.remove('body-cursor-red');
        document.body.classList.add('body-cursor-yellow');

        break;
      case SquareValues.GAMER_YELLOW:
        console.log('yellow');
        squareAdded.squareValue = SquareValues.GAMER_YELLOW;
        checkerAddedHTMLElement.classList.remove('checker_empty');
        checkerAddedHTMLElement.classList.add('checker_yellow');
        if (IsCurrentGamerWin(currentGamer, grid, squareAdded)) {
          alert(SquareValues[currentGamer] + ' win!!!');
        }

        currentGamer = SquareValues.GAMER_RED;
        document.body.classList.remove('body-cursor-yellow');
        document.body.classList.add('body-cursor-red');

    }
  } else {
    console.log('No Square empty on the column: ', this.columnIndex);
  }
};

export const main: () => void = (): void => {

  document.body.classList.add('body-cursor-red');

  // See:
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
  // And https://developer.mozilla.org/en-US/docs/Web/API/URL
  const parsedUrl: URL = new URL(document.location.href);
  console.log('URL query param gamemode: ',
    parsedUrl.searchParams.get('gamemode'));

  const grid: Square[][] = new Array(GRID_COLUMN_LENGTH);

  const baseCent: number = 100;
  const htmlStylElement: HTMLStyleElement = document.createElement('style');
  htmlStylElement.type = 'text/css';
  htmlStylElement.innerHTML = '.chacker_calculated { height: ' +
    (baseCent / GRID_ROW_LENGTH) + '%; }';
  document.getElementsByTagName('head')[0]
    .appendChild(htmlStylElement);

  const htmlStylElementKeyframes: HTMLStyleElement =
    document.createElement('style');
  htmlStylElementKeyframes.type = 'text/css';
  document.getElementsByTagName('head')[0]
    .appendChild(htmlStylElementKeyframes);

  for (let columnIndex: number = 0 ;
          columnIndex < GRID_COLUMN_LENGTH ;
          columnIndex++) {

    grid[columnIndex] = new Array(GRID_ROW_LENGTH);

    const columnHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.classList.add('column');

    for (let rowIndex: number = 0 ; rowIndex < GRID_ROW_LENGTH ; rowIndex++) {

      if (columnIndex === 0) {
        htmlStylElement.innerHTML += ' ' +
          '.chacker_calculated_row_' + rowIndex +
          '{ transform:translateY(' +
          (baseCent * rowIndex) + '%); }';
      }

      const checker: HTMLElement = document.createElement('div');
      checker.classList.add('checker');
      checker.classList.add('chacker_calculated');
      checker.classList.add('chacker_calculated_row_'
        + rowIndex);
      checker.classList.add('checker_empty');
      const square: Square = new Square(columnIndex, rowIndex,
          SquareValues.EMPTY_SQUARE, checker);
      grid[columnIndex][rowIndex] = square;

      const squareHTMLElement: HTMLElement = document.createElement('div');
      squareHTMLElement.classList.add('square');
      squareHTMLElement.addEventListener('click', (e: Event) => {
        e.preventDefault();
        squareOnClick.call(square, grid, htmlStylElementKeyframes);
      }, false);

      columnHTMLElement.appendChild(checker);

      columnHTMLElement.appendChild(squareHTMLElement);

    }

    document.body.appendChild(columnHTMLElement);

    const squareRedHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.appendChild(squareRedHTMLElement);

  }

};

// vim: ts=2 sw=2 et:
