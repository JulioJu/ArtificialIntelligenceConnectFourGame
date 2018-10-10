/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sun 30 Sep 2018 10:17:56 AM CEST
  *       MODIFIED: Wed 10 Oct 2018 02:10:21 PM CEST
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
import { AIHeuristic1 } from './artificial-intelligence/ai-heuristic1.js';

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

export const GameModeVsComputerComputerTurn: () => void = (): void => {
  AIHeuristic1()
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
      AddCheckerInSquare(square);
    })
    // https://en.wikipedia.org/wiki/Defensive_programming
    // Should never be triggered.
    .catch((drawnMatches: Error) => console.info(drawnMatches.message));
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
          GameModeVsComputerComputerTurn();
        }
        , false
      );
    }
    AddCheckerInSquare(squareWithCheckerAdded);
    if (storeSingleton.gameMode === GameMode.MULTIPLAYER) {
      CursorColor();
    }
  } else {
    console.info('No Square empty on the column: ', this.columnIndex);
  }
};

// vim: ts=2 sw=2 et:
