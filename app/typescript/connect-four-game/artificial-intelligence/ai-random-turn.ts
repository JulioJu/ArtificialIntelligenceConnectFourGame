/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
  *       MODIFIED: Fri 12 Oct 2018 04:41:45 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../Square.js';
import { storeSingleton } from '../store-singleton.js';

export const AIRandomTurn: () => Promise<Square>
      = async (): Promise<Square> =>
  new Promise<Square>((resolve: (square: Square) => void,
        reject: (drawnMatches: Error) => void): void => {
    if (storeSingleton.squaresEmptyPlayable.length === 0) {
      // https://en.wikipedia.org/wiki/Defensive_programming
      // Should never be triggered.
      reject(new Error('Drawn matches'));
    }
    const squareWithCheckerAdded: Square = storeSingleton.squaresEmptyPlayable[
      Math.floor(Math.random()
          * Math.floor(storeSingleton.squaresEmptyPlayable.length))];
    resolve(squareWithCheckerAdded);
  });

// vim: ts=2 sw=2 et:
