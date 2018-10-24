/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Fri 28 Sep 2018 09:06:49 AM CEST
  *       MODIFIED: Wed 24 Oct 2018 02:33:52 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { CHECKERS_ALIGN_TO_WIN }
  from './constants.js';
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

type IsCurrentGamerWinType = (squareAdded: Square) => boolean;

const isFourCheckerOfCurrentGamer: (
        firstSideLoop: LoopExploreGridFromOneSquare,
        secondSideLoop?: LoopExploreGridFromOneSquare) => boolean
      = (
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
          === storeSingleton.currentGamer) {
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
          === storeSingleton.currentGamer) {
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

export const IsCurrentGamerWin: IsCurrentGamerWinType
      = (squareAdded: Square): boolean => {
  if (isFourCheckerOfCurrentGamer(
          HorizontalLeft(squareAdded),
          HorizontalRight(squareAdded))) {
    return true;
  }
  if (isFourCheckerOfCurrentGamer(
          DiagonalNorthWest(squareAdded),
          DiagonalSouthEast(squareAdded))) {
    return true;
  }
  if (isFourCheckerOfCurrentGamer(VerticalSouth(squareAdded))) {
    return true;
  }
  if (isFourCheckerOfCurrentGamer(
          DiagonalNorthEast(squareAdded),
          DiagonalSouthWest(squareAdded))) {
    return true;
  }
  return false;
};

// vim: ts=2 sw=2 et:
