/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:04:32 PM CEST
  *       MODIFIED: Thu 04 Oct 2018 09:21:48 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH, SquareChecker } from './constants.js';
import { Square } from './Square.js';
import { IsCurrentGamerWin } from './is-current-gamer-win.js';
import { storeSingleton } from './store-singleton.js';

const performAnimation: (squareWithCheckerAdded: Square,
    animationName: string) => void
    = (squareWithCheckerAdded: Square,
      animationName: string): void => {

  const checkerAddedHTMLElement: HTMLElement =
          squareWithCheckerAdded.checkerHTMLElement;

  const gamerColor: string = SquareChecker[storeSingleton.currentGamer]
          .toLowerCase();

  const checkerColor: string =
          storeSingleton.currentGamer === SquareChecker.GAMER_RED
          ? 'checker_red'
          : 'checker_yellow';

  squareWithCheckerAdded.squareValue = storeSingleton.currentGamer;

  checkerAddedHTMLElement.classList.remove('checker_empty');
  checkerAddedHTMLElement.classList.add(checkerColor);
  checkerAddedHTMLElement.style.animationName = animationName;

  if (IsCurrentGamerWin(squareWithCheckerAdded)) {
    alert(gamerColor + ' win!!!');
  }

  // Change gamer
  storeSingleton.currentGamer =
          storeSingleton.currentGamer === SquareChecker.GAMER_RED
          ?  storeSingleton.currentGamer = SquareChecker.GAMER_YELLOW
          :  storeSingleton.currentGamer = SquareChecker.GAMER_RED;

};

export const AddCheckerInSquare: (squareWithCheckerAdded: Square,
        styleSheet: CSSStyleSheet) => void
        = (squareWithCheckerAdded: Square, styleSheet: CSSStyleSheet): void => {
  storeSingleton.numberOfClick++;
  const numberOfClick: string = storeSingleton.numberOfClick.toString();
  console.info('For click number ', numberOfClick,
    ', the first Square empty on the bottom of the column clicked is: ',
    squareWithCheckerAdded);

  const calculatedkeyFramesMarginTop: string = (window.innerHeight
    - ((GRID_ROW_LENGTH - squareWithCheckerAdded.rowIndex)
          * squareWithCheckerAdded.checkerHTMLElement.offsetHeight)
    + squareWithCheckerAdded.checkerHTMLElement.offsetHeight
  ).toString();
  const keyframeRuleName: string = 'slidein_' + numberOfClick;

  styleSheet.insertRule('@keyframes '  + keyframeRuleName  + ' { ' +
    'from { margin-top: -' + calculatedkeyFramesMarginTop  +
    'px; } to { margin-top: 0px; } }', styleSheet.cssRules.length);

  const cssKeyframRules: CSSKeyframesRule =
    styleSheet.cssRules[styleSheet.cssRules.length - 1] as CSSKeyframesRule;
  console.debug(cssKeyframRules);

  storeSingleton.currentGamer === SquareChecker.GAMER_RED
      /* tslint:disable-next-line:no-void-expression */
      ?  performAnimation(squareWithCheckerAdded, keyframeRuleName)
      /* tslint:disable-next-line:no-void-expression */
      : performAnimation(squareWithCheckerAdded, keyframeRuleName);
};

// vim: ts=2 sw=2 et:
