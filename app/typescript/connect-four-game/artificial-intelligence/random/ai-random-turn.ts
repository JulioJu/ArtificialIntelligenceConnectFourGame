/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
  *       MODIFIED: Wed 06 Mar 2019 03:24:44 PM CET
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
    Math.floor(Math.random() * storeSingleton.squaresEmptyPlayable.length)];
};

// vim: ts=2 sw=2 et:
