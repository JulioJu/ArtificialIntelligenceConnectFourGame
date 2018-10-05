/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:04:32 PM CEST
  *       MODIFIED: Fri 05 Oct 2018 04:35:55 PM CEST
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

const popupWin: () => void = (): void => {
  const popupWinHtmlElement: HTMLElement | null =
    document.getElementById('popup_win');
  if (popupWinHtmlElement) {
    popupWinHtmlElement.classList.remove('overlay_');
    popupWinHtmlElement.classList.add('overlay_visible');
    const contentHtmlElement: HTMLElement | null =
      document.querySelector('#popup_win > .popup > .content');
    if (contentHtmlElement) {
      if (storeSingleton.currentGamer === SquareChecker.GAMER_RED) {
        contentHtmlElement.innerText = 'Gamer red win!!!';
        contentHtmlElement.classList.add('gamer_red_win');
      } else {
        contentHtmlElement.innerText = 'Gamer yellow win!!!';
        contentHtmlElement.classList.add('gamer_yellow_win');
      }
    }
    const closePopupHtmlElement: HTMLElement | null =
      document.querySelector('#popup_win > .popup > .close');
    if (closePopupHtmlElement) {
      closePopupHtmlElement.addEventListener('click', () => {
        popupWinHtmlElement.classList.add('overlay_');
        popupWinHtmlElement.classList.remove('overlay_visible');
      });
    }
  }
};

const performAnimation: (squareWithCheckerAdded: Square,
    animationName: string) => void
    = (squareWithCheckerAdded: Square,
      animationName: string): void => {

  const checkerAddedHTMLElement: HTMLElement =
          squareWithCheckerAdded.checkerHTMLElement;

  const checkerColor: string =
          storeSingleton.currentGamer === SquareChecker.GAMER_RED
          ? 'checker_red'
          : 'checker_yellow';

  squareWithCheckerAdded.squareValue = storeSingleton.currentGamer;

  checkerAddedHTMLElement.classList.remove('checker_empty');
  checkerAddedHTMLElement.classList.add(checkerColor);
  checkerAddedHTMLElement.style.animationName = animationName;

  if (IsCurrentGamerWin(squareWithCheckerAdded)) {
    popupWin();
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
