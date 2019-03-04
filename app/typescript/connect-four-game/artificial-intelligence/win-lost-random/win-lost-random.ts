/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
  *       MODIFIED: Mon 04 Mar 2019 05:52:14 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../../Square.js';
import { storeSingleton } from '../../store-singleton.js';
import { IsGamerWin } from '../../is-gamer-win.js';

export const AIWinLostRandomTurn: () => Square | undefined
      = (): Square | undefined => {
  if (storeSingleton.squaresEmptyPlayable.length === 0) {
    // https://en.wikipedia.org/wiki/Defensive_programming
    // Should never be triggered.
    return undefined;
  }
  for (const squareEmpty of storeSingleton.squaresEmptyPlayable) {
    if (IsGamerWin(squareEmpty, storeSingleton.currentGamer)) {
      return squareEmpty;
    }
  }
  for (const squareEmpty of storeSingleton.squaresEmptyPlayable) {
    if (IsGamerWin(squareEmpty, storeSingleton.opponentGamer())) {
      return squareEmpty;
    }
  }
  return storeSingleton.squaresEmptyPlayable[
    Math.floor(Math.random()
        * Math.floor(storeSingleton.squaresEmptyPlayable.length))];
};

// vim: ts=2 sw=2 et:
