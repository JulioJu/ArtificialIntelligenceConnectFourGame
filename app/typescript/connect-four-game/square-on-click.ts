/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sun 30 Sep 2018 10:17:56 AM CEST
  *       MODIFIED: Tue 02 Oct 2018 07:45:14 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH } from './constants.js';
import { Square } from './Square.js';
import { SquareValues } from './SquareValues.js';
import { IsCurrentGamerWin } from './isCurrentGamerWin.js';
import { storeSingleton } from './store-singleton.js';
import { SquarePlayable } from './artificial-intelligence/squares-playable.js';

const clickAction: (squareAdded: Square,
    animationName: string) => void
    = (squareAdded: Square,
      animationName: string): void => {

  const checkerAddedHTMLElement: HTMLElement = squareAdded.checkerHTMLElement;

  let gamerColor: string = SquareValues[storeSingleton.currentGamer]
          .toLowerCase();

  const checkerColor: string =
          storeSingleton.currentGamer === SquareValues.GAMER_RED
          ? 'checker_red'
          : 'checker_yellow';

  squareAdded.squareValue = storeSingleton.currentGamer;

  checkerAddedHTMLElement.classList.remove('checker_empty');
  checkerAddedHTMLElement.classList.add(checkerColor);
  checkerAddedHTMLElement.style.animationName = animationName;

  if (IsCurrentGamerWin(squareAdded)) {
    alert(gamerColor + ' win!!!');
  }

  console.log(SquarePlayable());

  // Change gamer
  storeSingleton.currentGamer =
          storeSingleton.currentGamer === SquareValues.GAMER_RED
          ?  storeSingleton.currentGamer = SquareValues.GAMER_YELLOW
          :  storeSingleton.currentGamer = SquareValues.GAMER_RED;

  // Change cursor color
  document.body.classList.remove('body-cursor-' + gamerColor);
  gamerColor = SquareValues[storeSingleton.currentGamer]
          .toLowerCase();
  document.body.classList.add('body-cursor-' + gamerColor);
};

// Should not be an arrow function, because `this'
// doesn't exists in Arrow function
export const SquareOnClick:
    (this: Square, styleSheet: CSSStyleSheet) => void
    = function(this: Square, styleSheet: CSSStyleSheet): void {
  console.log('Square clicked: ', this);
  let squareAdded: Square | undefined;
  for (let rowIndex: number = GRID_ROW_LENGTH - 1 ;
          rowIndex >= 0 ;
          rowIndex--) {
    const square: Square = storeSingleton.grid[this.columnIndex][rowIndex];
    if (square.squareValue === SquareValues.EMPTY_SQUARE) {
      squareAdded = square;
      break;
    }
  }
  if (squareAdded) {

    storeSingleton.numberOfClick++;
    const numberOfClick: string = storeSingleton.numberOfClick.toString();
    console.log('For click number ', numberOfClick,
      ', the first Square empty on the bottom of the column clicked is: ',
      squareAdded);

    const calculatedkeyFramesMarginTop: string = (window.innerHeight
      - ((GRID_ROW_LENGTH - squareAdded.rowIndex)
            * squareAdded.checkerHTMLElement.offsetHeight)
      + squareAdded.checkerHTMLElement.offsetHeight
    ).toString();
    const keyframeRuleName: string = 'slidein_' + numberOfClick;

    styleSheet.insertRule('@keyframes '  + keyframeRuleName  + ' { ' +
      'from { margin-top: -' + calculatedkeyFramesMarginTop  +
      'px; } to { margin-top: 0px; } }', styleSheet.cssRules.length);

    const cssKeyframRules: CSSKeyframesRule =
      styleSheet.cssRules[styleSheet.cssRules.length - 1] as CSSKeyframesRule;
    console.log(cssKeyframRules);

    storeSingleton.currentGamer === SquareValues.GAMER_RED
        /* tslint:disable-next-line:no-void-expression */
        ?  clickAction(squareAdded, keyframeRuleName)
        /* tslint:disable-next-line:no-void-expression */
        : clickAction(squareAdded, keyframeRuleName);

  } else {
    console.log('No Square empty on the column: ', this.columnIndex);
  }
};

// vim: ts=2 sw=2 et:
