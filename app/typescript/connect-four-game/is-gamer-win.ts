/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Fri 28 Sep 2018 09:06:49 AM CEST
  *       MODIFIED: Thu 25 Oct 2018 09:54:50 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Checker, CHECKERS_ALIGN_TO_WIN } from './constants.js';
import { Square } from './Square.js';
import { storeSingleton } from './store-singleton.js';

import { LoopExploreGridFromOneSquare }
  from './loop-explore-grid-from-one-square/LoopExploreGridFromOneSquare.js';
import { HorizontalLeft, HorizontalRight }
  from './loop-explore-grid-from-one-square/horizontal.js';
import { DiagonalNorthWest,
  DiagonalSouthEast }
  from './loop-explore-grid-from-one-square/diagonal-north-west-south-east.js';
import { VerticalSouth }
  from './loop-explore-grid-from-one-square/vertical.js';
import { DiagonalNorthEast,
  DiagonalSouthWest }
  from './loop-explore-grid-from-one-square/diagonal-north-east-south-west.js';

const isFourCheckerOfGamer: (gamer: Checker,
        firstSideLoop: LoopExploreGridFromOneSquare,
        secondSideLoop?: LoopExploreGridFromOneSquare) => boolean
      = (gamer: Checker,
         firstSideLoop: LoopExploreGridFromOneSquare,
         secondSideLoop?: LoopExploreGridFromOneSquare): boolean => {

  let checkersAligned: number = 1;

  // First side of the Square
  // tslint:disable-next-line:one-variable-per-declaration
  for (let columnIndex: number = firstSideLoop.columnIndexInit,
          rowIndex: number = firstSideLoop.rowIndexInit;
      firstSideLoop.loopWhile(columnIndex, rowIndex);
      // tslint:disable-next-line:ban-comma-operator
      columnIndex = firstSideLoop.columnIndexIncrement(columnIndex),
          rowIndex = firstSideLoop.rowIndexIncrement(rowIndex)) {
    if (storeSingleton.grid[columnIndex][rowIndex].squareValue
          === gamer) {
      checkersAligned++;
    } else {
      break;
    }
  }
  if (checkersAligned === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }

  if (!secondSideLoop) {
    return false;
  }

  // Second side of the Square
  // tslint:disable-next-line:one-variable-per-declaration
  for (let columnIndex: number = secondSideLoop.columnIndexInit,
          rowIndex: number = secondSideLoop.rowIndexInit ;
      secondSideLoop.loopWhile(columnIndex, rowIndex) ;
      // tslint:disable-next-line:ban-comma-operator
      columnIndex = secondSideLoop.columnIndexIncrement(columnIndex),
          rowIndex = secondSideLoop.rowIndexIncrement(rowIndex)) {
  // HorizontalLeft, on the east of the squareAdded
    if (storeSingleton.grid[columnIndex][rowIndex].squareValue
          === gamer) {
      checkersAligned++;
    } else {
      break;
    }
  }
  if (checkersAligned === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }
  return false;
};

type IsGamerWinType = (squareAdded: Square, gamer: Checker)
  => boolean;
export const IsGamerWin: IsGamerWinType
      = (squareAdded: Square, gamer: Checker): boolean => {
  if (isFourCheckerOfGamer(gamer,
          HorizontalLeft(squareAdded),
          HorizontalRight(squareAdded))) {
    return true;
  }
  if (isFourCheckerOfGamer(gamer,
          DiagonalNorthWest(squareAdded),
          DiagonalSouthEast(squareAdded))) {
    return true;
  }
  if (isFourCheckerOfGamer(gamer,
        VerticalSouth(squareAdded))) {
    return true;
  }
  if (isFourCheckerOfGamer(gamer,
          DiagonalNorthEast(squareAdded),
          DiagonalSouthWest(squareAdded))) {
    return true;
  }
  return false;
};

// vim: ts=2 sw=2 et:
