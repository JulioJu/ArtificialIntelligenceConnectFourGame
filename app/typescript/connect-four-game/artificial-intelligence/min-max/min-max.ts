/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
  *       MODIFIED: Fri 01 Mar 2019 04:15:49 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../../Square.js';
import { storeSingleton } from '../../store-singleton.js';

export const AIMinMaxTurn: () => Square | undefined
      = (): Square | undefined => {
    // TODO
  if (storeSingleton.squaresEmptyPlayable.length === 0) {
    // https://en.wikipedia.org/wiki/Defensive_programming
    // Should never be triggered.
    return undefined;
  }
  throw new Error('Not implemented exception.');
};

// vim: ts=2 sw=2 et:
