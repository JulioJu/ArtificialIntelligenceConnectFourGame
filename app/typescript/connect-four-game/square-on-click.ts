/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sun 30 Sep 2018 10:17:56 AM CEST
  *       MODIFIED: Mon 01 Oct 2018 09:50:09 PM CEST
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

const clickAction: (squareAdded: Square,
    checkerAddedHTMLElement: HTMLElement,
    htmlStylElementKeyframes: HTMLElement) => void
    = (squareAdded: Square,
      checkerAddedHTMLElement: HTMLElement,
      htmlStylElementKeyframes: HTMLElement): void => {

  let gamerColor: string = SquareValues[storeSingleton.currentGamer]
          .toLowerCase();

  const colorRGB: string =
          storeSingleton.currentGamer === SquareValues.GAMER_RED
          ? 'rgb(217, 41, 0)'
          : 'rgb(241, 204, 0)';
  const numberOfClick: string = storeSingleton.numberOfClick.toString();

  squareAdded.squareValue = storeSingleton.currentGamer;

  checkerAddedHTMLElement.classList.remove('checker_empty');
  htmlStylElementKeyframes.innerHTML +=
  '.checker_' + gamerColor + numberOfClick +
  ' {background: radial-gradient(circle closest-side, '
          + colorRGB + '75%, transparent 95%);' +
  'animation-name: slidein_'  + numberOfClick + ' ;}';
  checkerAddedHTMLElement.classList.add('checker_' + gamerColor +
  numberOfClick);

  if (IsCurrentGamerWin(squareAdded)) {
    alert(gamerColor + ' win!!!');
  }

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
    (this: Square) => void
    = function(this: Square): void {
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

    const htmlStylElementKeyframes: HTMLStyleElement =
      document.createElement('style');
    document.getElementsByTagName('head')[0]
      .appendChild(htmlStylElementKeyframes);
    const calculatedkeyFramesMarginTop: string = (window.innerHeight
      - ((GRID_ROW_LENGTH - squareAdded.rowIndex)
            * squareAdded.checkerHTMLElement.offsetHeight)
      + squareAdded.checkerHTMLElement.offsetHeight
    ).toString();
    htmlStylElementKeyframes.innerHTML =
      '@keyframes slidein_' + numberOfClick + ' { ' +
      'from { margin-top: -' + calculatedkeyFramesMarginTop  +
      'px; } to { margin-top: 0px; } }';

    storeSingleton.currentGamer === SquareValues.GAMER_RED
        /* tslint:disable-next-line:no-void-expression */
        ?  clickAction(squareAdded, squareAdded.checkerHTMLElement,
          htmlStylElementKeyframes)
        /* tslint:disable-next-line:no-void-expression */
        : clickAction(squareAdded, squareAdded.checkerHTMLElement,
          htmlStylElementKeyframes);

  } else {
    console.log('No Square empty on the column: ', this.columnIndex);
  }
};

// vim: ts=2 sw=2 et:
