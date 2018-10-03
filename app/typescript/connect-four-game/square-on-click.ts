/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sun 30 Sep 2018 10:17:56 AM CEST
  *       MODIFIED: Wed 03 Oct 2018 09:19:43 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH } from './constants.js';
import { Square } from './Square.js';
import { SquareValues } from './SquareValues.js';
import { GameMode, storeSingleton } from './store-singleton.js';
import { AddCheckerInSquare } from './add-checker-in-square.js';
import { AIRandomTurn } from './artificial-intelligence/ai-random-turn.js';

// Should not be an arrow function, because `this'
// doesn't exists in Arrow function
export const SquareOnClick:
      (this: Square, styleSheet: CSSStyleSheet) => void
      = function(this: Square, styleSheet: CSSStyleSheet): void {

  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
    && storeSingleton.currentGamer === SquareValues.GAMER_YELLOW) {
    return;
  }

  console.info('Square clicked: ', this);
  let squareWithCheckerAdded: Square | undefined;
  for (let rowIndex: number = GRID_ROW_LENGTH - 1 ;
          rowIndex >= 0 ;
          rowIndex--) {
    const square: Square = storeSingleton.grid[this.columnIndex][rowIndex];
    if (square.squareValue === SquareValues.EMPTY_SQUARE) {
      squareWithCheckerAdded = square;
      break;
    }
  }
  if (squareWithCheckerAdded) {

    AddCheckerInSquare(squareWithCheckerAdded, styleSheet);

    AIRandomTurn(styleSheet);

  } else {
    console.info('No Square empty on the column: ', this.columnIndex);
  }
};

// vim: ts=2 sw=2 et:
