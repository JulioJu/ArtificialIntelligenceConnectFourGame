/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Thu 04 Oct 2018 08:46:56 PM CEST
  *       MODIFIED: Fri 12 Oct 2018 04:36:27 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from './Square.js';
import { AddCheckerInSquare } from './square-add-checker.js';
import { GameMode, Checker } from './constants.js';
import { storeSingleton } from './store-singleton.js';
import { CursorColor } from './square-on-click.js';

const triggerNewTurn: (square: Square) => void = (square: Square): void => {
  square.checkerHTMLElement.addEventListener(
    'animationend', (eInner: Event) => {
      eInner.preventDefault();
      if (storeSingleton.gameMode === GameMode.ONLY_COMPUTER) {
        // tslint:disable-next-line:no-use-before-declare
        ComputerTurn();
      } else {
          // After the animation time of the computer turn, the
          // gamer can play again.
          storeSingleton.isComputerToPlay = false;
          CursorColor();
      }
    }
    , false
  );
  AddCheckerInSquare(square);
};

export const ComputerTurn: () => void = (): void => {
  if (storeSingleton.gameIsTerminated) {
    console.info('It\'s the computer turn, but the game',
      'is terminated.');
    return;
  }
  if (storeSingleton.currentGamer === Checker.RED) {
    storeSingleton.artificialIntelligenceGamerRed()
      .then((square: Square) => {
        triggerNewTurn(square);
      })
      // https://en.wikipedia.org/wiki/Defensive_programming
      // Should never be triggered.
      .catch((drawnMatches: Error) => console.info(drawnMatches.message));
  } else if (storeSingleton.currentGamer === Checker.YELLOW) {
    storeSingleton.artificialIntelligenceGamerYellow()
      .then((square: Square) => {
        triggerNewTurn(square);
      })
      // https://en.wikipedia.org/wiki/Defensive_programming
      // Should never be triggered.
      .catch((drawnMatches: Error) => console.info(drawnMatches.message));
  }
};

// vim: ts=2 sw=2 et:
