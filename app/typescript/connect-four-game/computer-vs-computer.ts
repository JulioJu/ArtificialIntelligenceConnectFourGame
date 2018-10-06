/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Thu 04 Oct 2018 08:46:56 PM CEST
  *       MODIFIED: Sat 06 Oct 2018 02:22:53 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from './Square.js';
import { AddCheckerInSquare } from './square-add-checker.js';
import { storeSingleton } from './store-singleton.js';
import { AIRandomTurn } from './artificial-intelligence/ai-random-turn.js';

export const GameModeComputerVsComputer:
      (styleSheet: CSSStyleSheet) => void
      = (styleSheet: CSSStyleSheet): void => {
  if (storeSingleton.gameIsTerminated) {
    console.info('It\'s the computer turn, but the game',
      'is terminated.');
    return;
  }
  AIRandomTurn()
    .then((square: Square) => {
      square.checkerHTMLElement.addEventListener(
        'animationend', (eInner: Event) => {
          eInner.preventDefault();
          GameModeComputerVsComputer(styleSheet);
        }
        , false
      );
      AddCheckerInSquare(square, styleSheet);
    }
    )
    .catch((drawnMatches: Error) => console.info(drawnMatches.message));
};

// vim: ts=2 sw=2 et:
