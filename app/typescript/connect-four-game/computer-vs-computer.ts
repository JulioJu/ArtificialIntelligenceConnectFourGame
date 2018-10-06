/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Thu 04 Oct 2018 08:46:56 PM CEST
  *       MODIFIED: Sat 06 Oct 2018 01:16:20 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from './Square.js';
import { AddCheckerInSquare } from './square-add-checker.js';
import { AIRandomTurn } from './artificial-intelligence/ai-random-turn.js';

export const GameModeComputerVsComputer:
      (styleSheet: CSSStyleSheet) => void
      = (styleSheet: CSSStyleSheet): void => {
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
