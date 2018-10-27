/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
  *       MODIFIED: Sat 27 Oct 2018 05:38:59 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../Square.js';
import { storeSingleton } from '../store-singleton.js';

export const AIRandomTurn: () => Square | undefined
      = (): Square | undefined => {
  if (storeSingleton.squaresEmptyPlayable.length === 0) {
    // https://en.wikipedia.org/wiki/Defensive_programming
    // Should never be triggered.
    return undefined;
  }
  const squareWithCheckerAdded: Square = storeSingleton.squaresEmptyPlayable[
    Math.floor(Math.random()
        * Math.floor(storeSingleton.squaresEmptyPlayable.length))];
  return squareWithCheckerAdded;
};

// vim: ts=2 sw=2 et:
