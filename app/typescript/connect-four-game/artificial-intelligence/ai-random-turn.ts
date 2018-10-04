/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
  *       MODIFIED: Thu 04 Oct 2018 05:59:07 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../Square.js';
import { SquarePlayable } from '../artificial-intelligence/squares-playable.js';

export const AIRandomTurn: () => Promise<Square>
      = async (): Promise<Square> =>
  new Promise<Square>((resolve: (square: Square) => void): void => {
    const squarePlayagle: Square[] = SquarePlayable();
    console.debug(squarePlayagle);
    const squareWithCheckerAdded: Square = squarePlayagle[
      Math.floor(Math.random() * Math.floor(squarePlayagle.length))];
    resolve(squareWithCheckerAdded);
  });

// vim: ts=2 sw=2 et:
