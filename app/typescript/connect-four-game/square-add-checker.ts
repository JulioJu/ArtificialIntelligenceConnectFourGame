/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:04:32 PM CEST
  *       MODIFIED: Sat 06 Oct 2018 02:21:52 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH, Checker } from './constants.js';
import { Square } from './Square.js';
import { PopulateSquareEmptyPlayables } from
    './squares-empty-playable-populate.js';
import { IsCurrentGamerWin } from './is-current-gamer-win.js';
import { storeSingleton } from './store-singleton.js';

const displayPopup: (callback: (contentHtmlElement: HTMLElement) => void)
          => void
      = (callback: (contentHtmlElement: HTMLElement) => void): void => {
  const popupWinHtmlElement: HTMLElement | null =
    document.getElementById('popup_container');
  if (popupWinHtmlElement) {
    popupWinHtmlElement.classList.remove('overlay_');
    popupWinHtmlElement.classList.add('overlay_visible');
    const contentHtmlElement: HTMLElement | null =
      document.querySelector('#popup_container > .popup > .content');
    if (contentHtmlElement) {
      callback(contentHtmlElement);
    }
    const closePopupHtmlElement: HTMLElement | null =
      document.querySelector('#popup_container > .popup > .close');
    if (closePopupHtmlElement) {
      closePopupHtmlElement.addEventListener('click', () => {
        popupWinHtmlElement.classList.add('overlay_');
        popupWinHtmlElement.classList.remove('overlay_visible');
      });
    }
  }
};

const popupDrawnMatches: () => void = (): void => {
  displayPopup((contentHtmlElement: HTMLElement) => {
    contentHtmlElement.innerText = 'Drawn matches!!!';
    contentHtmlElement.classList.add('drawn_matches');
  });
};

const popupWin: () => void = (): void => {
  displayPopup((contentHtmlElement: HTMLElement) => {
    if (storeSingleton.currentGamer === Checker.RED) {
      contentHtmlElement.innerText = 'Gamer red win!!!';
      contentHtmlElement.classList.add('gamer_red_win');
    } else {
      contentHtmlElement.innerText = 'Gamer yellow win!!!';
      contentHtmlElement.classList.add('gamer_yellow_win');
    }
  });
};

const performAnimation: (squareWithCheckerAdded: Square,
    animationName: string) => void
    = (squareWithCheckerAdded: Square,
      animationName: string): void => {

  const checkerAddedHTMLElement: HTMLElement =
          squareWithCheckerAdded.checkerHTMLElement;

  const checkerColor: string =
          storeSingleton.currentGamer === Checker.RED
          ? 'checker_red'
          : 'checker_yellow';

  squareWithCheckerAdded.squareValue = storeSingleton.currentGamer;

  checkerAddedHTMLElement.classList.remove('checker_empty');
  checkerAddedHTMLElement.classList.add(checkerColor);
  checkerAddedHTMLElement.style.animationName = animationName;

  if (IsCurrentGamerWin(squareWithCheckerAdded)) {
    storeSingleton.gameIsTerminated = true;
    popupWin();
  }

  // Change gamer
  storeSingleton.currentGamer =
          storeSingleton.currentGamer === Checker.RED
          ?  storeSingleton.currentGamer = Checker.YELLOW
          :  storeSingleton.currentGamer = Checker.RED;

};

/**
 * Should be launch if it's not the end of the game
 * (storeSingleton.gameIsTerminated !== false)
 * DO NOT FORGET TO DO THE TEST
 */
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

  storeSingleton.currentGamer === Checker.RED
      /* tslint:disable-next-line:no-void-expression */
      ?  performAnimation(squareWithCheckerAdded, keyframeRuleName)
      /* tslint:disable-next-line:no-void-expression */
      : performAnimation(squareWithCheckerAdded, keyframeRuleName);

  storeSingleton.squaresEmptyPlayable = PopulateSquareEmptyPlayables();
  if (storeSingleton.squaresEmptyPlayable.length === 0) {
    storeSingleton.gameIsTerminated = true;
    popupDrawnMatches();
  }

};

// vim: ts=2 sw=2 et:
