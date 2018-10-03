/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
  *       MODIFIED: Wed 03 Oct 2018 09:24:43 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../Square.js';
import { SquareValues } from '../SquareValues.js';
import { GameMode, storeSingleton } from '../store-singleton.js';
import { SquarePlayable } from '../artificial-intelligence/squares-playable.js';
import { AddCheckerInSquare } from '../add-checker-in-square.js';

export const AIRandomTurn: (styleSheet: CSSStyleSheet) => void
      = (styleSheet: CSSStyleSheet): void => {
  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
    && storeSingleton.currentGamer === SquareValues.GAMER_YELLOW) {
    const squarePlayagle: Square[] = SquarePlayable();
    console.debug(squarePlayagle);
    const squareWithCheckerAdded: Square = squarePlayagle[
      Math.floor(Math.random() * Math.floor(squarePlayagle.length))];
    const WAIT_BEFORE_COMPUTER_PLAY: number = 3000;
    setTimeout(() => AddCheckerInSquare(squareWithCheckerAdded, styleSheet),
      WAIT_BEFORE_COMPUTER_PLAY);
  }
};

// vim: ts=2 sw=2 et:
