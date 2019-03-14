/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Thu 04 Oct 2018 08:46:56 PM CEST
  *       MODIFIED: Thu 14 Mar 2019 05:57:44 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from './Square.js';
import { AddCheckerInSquare } from './square-add-checker.js';
import { GameMode, Checker } from './constants.js';
import { storeSingleton , ILogMessage } from './store-singleton.js';
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
  console.info(storeSingleton.logMessages);
};

const logMessage = (timeOne: number, div: HTMLElement): void => {
  const logMessageVar: ILogMessage = {
        checker: Checker[storeSingleton.currentGamer],
        timeSpan: performance.now() - timeOne,
        div
      };
  if (
    storeSingleton.logMessages[storeSingleton.numberOfClick + 1]
    && storeSingleton.logMessages[storeSingleton.numberOfClick + 1]
        .statistics
  ) {
    logMessageVar.statistics =
      storeSingleton.logMessages[storeSingleton.numberOfClick + 1]
      .statistics;
  }
  storeSingleton.logMessages[storeSingleton.numberOfClick + 1] = logMessageVar;
};

export const ComputerTurn: () => void = (): void => {
  if (storeSingleton.gameIsTerminated) {
    console.info('It\'s the computer turn, but the game',
      'is terminated.');
    return;
  }
  const artificialIntelligenceGamer =
    storeSingleton.currentGamer === Checker.RED
    // tslint:disable-next-line:no-unbound-method
    ? storeSingleton.artificialIntelligenceGamerRed
    // tslint:disable-next-line:no-unbound-method
    : storeSingleton.artificialIntelligenceGamerYellow;

  const timeOne = performance.now();
  const square: Square | undefined = artificialIntelligenceGamer();
  if (square) {
    logMessage(timeOne, square.checkerHTMLElement);
    triggerNewTurn(square);
  } else {
    console.info('Drawn matches!');
  }
};

// vim: ts=2 sw=2 et:
