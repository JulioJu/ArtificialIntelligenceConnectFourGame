/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
  *       MODIFIED: Sun 28 Oct 2018 01:59:41 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../../Square.js';
import { storeSingleton } from '../../store-singleton.js';

export const AIRandomTurn: () => Square | undefined
      = (): Square | undefined => {
  if (storeSingleton.squaresEmptyPlayable.length === 0) {
    // https://en.wikipedia.org/wiki/Defensive_programming
    // Should never be triggered.
    return undefined;
  }
  return storeSingleton.squaresEmptyPlayable[
    Math.floor(Math.random()
        * Math.floor(storeSingleton.squaresEmptyPlayable.length))];
};

// vim: ts=2 sw=2 et:
