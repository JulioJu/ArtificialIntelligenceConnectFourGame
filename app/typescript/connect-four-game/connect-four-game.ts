/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED: Tue 02 Oct 2018 09:34:53 AM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH } from './constants.js';
import { Square } from './Square.js';
import { SquareValues } from './SquareValues.js';
import { SquareOnClick } from './square-on-click.js';
import { storeSingleton } from './store-singleton.js';

export const main: () => void = (): void => {

  document.body.classList.add('body-cursor-red');

  // See:
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
  // And https://developer.mozilla.org/en-US/docs/Web/API/URL
  const parsedUrl: URL = new URL(document.location.href);
  console.log('URL query param gamemode: ',
    parsedUrl.searchParams.get('gamemode'));

  const htmlStylElement: HTMLStyleElement =
    document.getElementById('generatedByCSSOM') as HTMLStyleElement;

  // htmlStylElement.innerHTML = '.checker_calculated { height: ' +
  //   (baseCent / GRID_ROW_LENGTH).toString() + '%; }';
  const styleSheet: CSSStyleSheet = htmlStylElement.sheet as CSSStyleSheet;
  const baseCent: number = 100;
  (styleSheet.cssRules[0] as CSSStyleRule).style.height =
    (baseCent / GRID_ROW_LENGTH).toString() + '%';

  for (let columnIndex: number = 0 ;
          columnIndex < GRID_COLUMN_LENGTH ;
          columnIndex++) {

    storeSingleton.grid[columnIndex] = new Array(GRID_ROW_LENGTH);

    const columnHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.classList.add('column');

    for (let rowIndex: number = 0 ; rowIndex < GRID_ROW_LENGTH ; rowIndex++) {

      if (columnIndex === 0) {
        styleSheet.insertRule('.checker_calculated_row_index_' +
          rowIndex.toString() +
              '{ transform:translateY(' +
              (baseCent * rowIndex).toString() + '%); }',
          styleSheet.cssRules.length);
        if (rowIndex === GRID_ROW_LENGTH - 1) {
          console.log(styleSheet);
        }
      }

      const checker: HTMLElement = document.createElement('div');
      checker.classList.add('checker');
      checker.classList.add('checker_calculated');
      checker.classList.add('checker_calculated_row_index_'
        + rowIndex.toString());
      checker.classList.add('checker_empty');
      const square: Square = new Square(columnIndex, rowIndex,
          SquareValues.EMPTY_SQUARE, checker);
      storeSingleton.grid[columnIndex][rowIndex] = square;

      const squareHTMLElement: HTMLElement = document.createElement('div');
      squareHTMLElement.classList.add('square');
      squareHTMLElement.addEventListener('click', (e: Event) => {
        e.preventDefault();
        SquareOnClick.call(square, htmlStylElement);
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
