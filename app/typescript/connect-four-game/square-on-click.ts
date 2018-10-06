/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sun 30 Sep 2018 10:17:56 AM CEST
  *       MODIFIED: Sat 06 Oct 2018 01:15:55 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH, GameMode, SquareChecker } from './constants.js';
import { Square } from './Square.js';
import { storeSingleton } from './store-singleton.js';
import { AddCheckerInSquare } from './square-add-checker.js';
import { AIRandomTurn } from './artificial-intelligence/ai-random-turn.js';

export const CursorColor: () => void = (): void => {
  document.body.classList.remove('cursor-gamer_red');
  document.body.classList.remove('cursor-gamer_yellow');
  document.body.classList.remove('cursor-not-allowed');
  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
          && storeSingleton.isComputerToPlay) {
      document.body.classList.add('cursor-not-allowed');
  } else {
    const gamerColor: string = SquareChecker[storeSingleton.currentGamer]
            .toLowerCase();
    document.body.classList.add('cursor-' + gamerColor);
  }
};

export const GameModeVsComputerComputerTurn:
      (styleSheet: CSSStyleSheet) => void
      = (styleSheet: CSSStyleSheet): void => {
  AIRandomTurn()
    .then((square: Square) => {
      square.checkerHTMLElement.addEventListener(
        'animationend', (eInner: Event) => {
          eInner.preventDefault();
          // After the animation time of the computer turn, the
          // gamer can play again.
          storeSingleton.isComputerToPlay = false;
          CursorColor();
        }
        , false
      );
      AddCheckerInSquare(square, styleSheet);
    }
    )
    .catch((drawnMatches: Error) => console.info(drawnMatches.message));
};

// Should not be an arrow function, because `this'
// doesn't exists in Arrow function
export const SquareOnClick:
      (this: Square, styleSheet: CSSStyleSheet) => void
      = function(this: Square, styleSheet: CSSStyleSheet): void {

  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
        && storeSingleton.isComputerToPlay) {
    return;
  }

  console.info('Square clicked: ', this);
  let squareWithCheckerAdded: Square | undefined;
  for (let rowIndex: number = GRID_ROW_LENGTH - 1 ;
          rowIndex >= 0 ;
          rowIndex--) {
    const square: Square = storeSingleton.grid[this.columnIndex][rowIndex];
    if (square.squareValue === SquareChecker.EMPTY_SQUARE) {
      squareWithCheckerAdded = square;
      break;
    }
  }
  if (squareWithCheckerAdded) {
    if (storeSingleton.gameMode === GameMode.VSCOMPUTER) {
      // Forbid immediatly action to onclick
      storeSingleton.isComputerToPlay = true;
      CursorColor();
      squareWithCheckerAdded.checkerHTMLElement.addEventListener(
        'animationend', (e: Event) => {
          e.preventDefault();
          GameModeVsComputerComputerTurn(styleSheet);
        }
        , false
      );
    }
    AddCheckerInSquare(squareWithCheckerAdded, styleSheet);
    if (storeSingleton.gameMode === GameMode.MULTIPLAYER) {
      CursorColor();
    }
  } else {
    console.info('No Square empty on the column: ', this.columnIndex);
  }
};

// vim: ts=2 sw=2 et:
