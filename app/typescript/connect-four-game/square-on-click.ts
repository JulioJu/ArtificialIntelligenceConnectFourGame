/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sun 30 Sep 2018 10:17:56 AM CEST
  *       MODIFIED: Fri 12 Oct 2018 04:35:44 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH, GameMode, Checker } from './constants.js';
import { Square } from './Square.js';
import { storeSingleton } from './store-singleton.js';
import { AddCheckerInSquare } from './square-add-checker.js';
import { ComputerTurn } from './computer-turn.js';

export const CursorColor: () => void = (): void => {
  document.body.classList.remove('cursor-red');
  document.body.classList.remove('cursor-yellow');
  document.body.classList.remove('cursor-not-allowed');
  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
          && storeSingleton.isComputerToPlay) {
      document.body.classList.add('cursor-not-allowed');
  } else {
    const gamerColor: string = Checker[storeSingleton.currentGamer]
            .toLowerCase();
    document.body.classList.add('cursor-' + gamerColor);
  }
};

// Should not be an arrow function, because `this'
// doesn't exists in Arrow function
export const SquareOnClick:
      (this: Square) => void = function(this: Square): void {

  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
        && storeSingleton.isComputerToPlay) {
    console.info('Wait until the computer turn is finished.');
    return;
  }
  if (storeSingleton.gameIsTerminated) {
    console.info('Game is terminated, your click has no effect.');
    return;
  }

  console.info('Square clicked: ', this);
  let squareWithCheckerAdded: Square | undefined;
  for (let rowIndex: number = GRID_ROW_LENGTH - 1 ;
          rowIndex >= 0 ;
          rowIndex--) {
    const square: Square = storeSingleton.grid[this.columnIndex][rowIndex];
    if (square.squareValue === Checker.EMPTY) {
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
          if (storeSingleton.gameIsTerminated) {
            console.info('It\'s the computer turn, but the game',
              'is terminated.');
            return;
          }
          ComputerTurn();
        }
        , false
      );
    }
    AddCheckerInSquare(squareWithCheckerAdded);
    if (storeSingleton.gameMode === GameMode.MULTIGAMER) {
      CursorColor();
    }
  } else {
    console.info('No Square empty on the column: ', this.columnIndex);
  }
};

// vim: ts=2 sw=2 et:
