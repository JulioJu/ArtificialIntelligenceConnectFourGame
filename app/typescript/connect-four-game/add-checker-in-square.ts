/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:04:32 PM CEST
  *       MODIFIED: Wed 03 Oct 2018 09:29:34 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH } from './constants.js';
import { Square } from './Square.js';
import { SquareValues } from './SquareValues.js';
import { IsCurrentGamerWin } from './is-current-gamer-win.js';
import { GameMode, storeSingleton } from './store-singleton.js';

const clickAction: (squareWithCheckerAdded: Square,
    animationName: string) => void
    = (squareWithCheckerAdded: Square,
      animationName: string): void => {

  const checkerAddedHTMLElement: HTMLElement =
          squareWithCheckerAdded.checkerHTMLElement;

  let gamerColor: string = SquareValues[storeSingleton.currentGamer]
          .toLowerCase();

  const checkerColor: string =
          storeSingleton.currentGamer === SquareValues.GAMER_RED
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
          storeSingleton.currentGamer === SquareValues.GAMER_RED
          ?  storeSingleton.currentGamer = SquareValues.GAMER_YELLOW
          :  storeSingleton.currentGamer = SquareValues.GAMER_RED;

  // Change cursor color
  document.body.classList.remove('cursor-' + gamerColor);
  document.body.classList.remove('cursor-not-allowed');
  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
    && storeSingleton.currentGamer === SquareValues.GAMER_YELLOW) {
      document.body.classList.add('cursor-not-allowed');
  } else {
    gamerColor = SquareValues[storeSingleton.currentGamer]
            .toLowerCase();
    document.body.classList.add('cursor-' + gamerColor);
  }
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

  storeSingleton.currentGamer === SquareValues.GAMER_RED
      /* tslint:disable-next-line:no-void-expression */
      ?  clickAction(squareWithCheckerAdded, keyframeRuleName)
      /* tslint:disable-next-line:no-void-expression */
      : clickAction(squareWithCheckerAdded, keyframeRuleName);
};

// vim: ts=2 sw=2 et:
