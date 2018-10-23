/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED: Tue 23 Oct 2018 04:27:33 PM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH, GameMode, Checker }
    from './constants.js';
import { ParseUrlQueryParam } from './parse-url-query-param.js';
import { Square } from './Square.js';
import { SquareOnClick, CursorColor }
    from './square-on-click.js';
import { storeSingleton } from './store-singleton.js';
import { ComputerTurn } from './computer-turn.js';

const triggerComputerGame: () => void = (): void => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    const keyName: string = event.key;
    if (keyName === 'c') {
      ComputerTurn();
      return;
    }
  }, false);
};

export const main: () => void = (): void => {

  ParseUrlQueryParam();
  if (storeSingleton.gameMode !== GameMode.ONLY_COMPUTER) {
    triggerComputerGame();
    // Should be after `parseUrlQueryParam()`
    CursorColor();
  } else {
    document.body.classList.add('cursor-not-allowed');
  }

  const baseCent: number = 100;
  (storeSingleton.styleSheet.cssRules[0] as CSSStyleRule).style.height =
    (baseCent / GRID_ROW_LENGTH).toString() + '%';

  for (let columnIndex: number = 0 ;
          columnIndex < GRID_COLUMN_LENGTH ;
          columnIndex++) {

    storeSingleton.grid[columnIndex] = new Array(GRID_ROW_LENGTH);

    const columnHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.classList.add('column');

    for (let rowIndex: number = 0 ; rowIndex < GRID_ROW_LENGTH ; rowIndex++) {

      if (columnIndex === 0) {
        storeSingleton.styleSheet.insertRule('.checker_calculated_row_index_' +
          rowIndex.toString() +
              '{ transform:translateY(' +
              (baseCent * rowIndex).toString() + '%); }',
          storeSingleton.styleSheet.cssRules.length);
        // if (rowIndex === GRID_ROW_LENGTH - 1) {
        //   console.debug(styleSheet);
        // }
      }

      const checker: HTMLElement = document.createElement('div');
      checker.classList.add('checker');
      checker.classList.add('checker_calculated');
      checker.classList.add('checker_calculated_row_index_'
        + rowIndex.toString());
      checker.classList.add('checker_empty');
      const square: Square = new Square(columnIndex, rowIndex,
          Checker.EMPTY, checker);
      storeSingleton.grid[columnIndex][rowIndex] = square;

      if (rowIndex === GRID_ROW_LENGTH - 1) {
        storeSingleton.squaresEmptyPlayable[columnIndex] =
          storeSingleton.grid[columnIndex][GRID_ROW_LENGTH - 1];
      }

      const squareHTMLElement: HTMLElement = document.createElement('div');
      squareHTMLElement.classList.add('square');
      if (storeSingleton.gameMode !== GameMode.ONLY_COMPUTER) {
        squareHTMLElement.addEventListener('click', (e: Event) => {
          e.preventDefault();
          SquareOnClick.call(square, storeSingleton.styleSheet);
        }, false);
      }

      columnHTMLElement.appendChild(checker);

      columnHTMLElement.appendChild(squareHTMLElement);

    }

    document.body.appendChild(columnHTMLElement);

    const squareRedHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.appendChild(squareRedHTMLElement);

  }

  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
        && storeSingleton.isComputerToPlay) {
    ComputerTurn();
  } else if (storeSingleton.gameMode === GameMode.ONLY_COMPUTER) {
    ComputerTurn();
  }

};

main();

// vim: ts=2 sw=2 et:
