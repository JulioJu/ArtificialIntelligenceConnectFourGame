/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Fri 28 Sep 2018 09:06:49 AM CEST
  *       MODIFIED: Sun 30 Sep 2018 11:36:09 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH, CHECKERS_ALIGN_TO_WIN }
  from './constants.js';
import { Square } from './Square.js';
import { storeSingleton } from './store-singleton.js';

type IsCurrentGamerWinType = (squareAdded: Square) => boolean;

const isFourCheckerOfCurrentGamerHorizontally: IsCurrentGamerWinType
      = (squareAdded: Square): boolean => {
  let checkersHorizontal: number = 1;
  // Horizontal, on the east of the squareAdded
  for (let columnIndex: number = squareAdded.columnIndex + 1;
      columnIndex < GRID_COLUMN_LENGTH ;
      columnIndex++) {
    if (storeSingleton.grid[columnIndex][squareAdded.rowIndex].squareValue
          === storeSingleton.currentGamer) {
      checkersHorizontal++;
    } else {
      break;
    }
  }
  if (checkersHorizontal === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }
  // Horizontal, on the west of the squareAdded
  for (let columnIndex: number = squareAdded.columnIndex - 1;
      columnIndex >= 0 ;
      columnIndex--) {
    if (storeSingleton.grid[columnIndex][squareAdded.rowIndex].squareValue
          === storeSingleton.currentGamer) {
      checkersHorizontal++;
    } else {
      break;
    }
  }
  if (checkersHorizontal === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }
  return false;
};

const isFourCheckerOfCurrentGamerOnNorthWestSouthEast: IsCurrentGamerWinType
      = (squareAdded: Square): boolean => {
  // DIAGONAL NORTH-WEST / SOUTH-EAST
  let checkersNorthWestSouthEast: number = 1;
  // Diagonal north-west of the squareAdded
  for (let index: number = 1 ; index < CHECKERS_ALIGN_TO_WIN ; index++) {
    if (squareAdded.columnIndex - index === -1
          || squareAdded.rowIndex - index === -1) {
      break;
    }
    if (storeSingleton.grid[squareAdded.columnIndex - index]
          [squareAdded.rowIndex - index].squareValue
              === storeSingleton.currentGamer) {
      checkersNorthWestSouthEast++;
    } else {
      break;
    }
  }
  if (checkersNorthWestSouthEast === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }
  // Diagonal south-east of the squareAdded
  for (let index: number = 1 ; index < CHECKERS_ALIGN_TO_WIN ; index++) {
    if (squareAdded.columnIndex + index === GRID_COLUMN_LENGTH
          || squareAdded.rowIndex + index === GRID_ROW_LENGTH) {
      break;
    }
    if (storeSingleton.grid[squareAdded.columnIndex + index]
          [squareAdded.rowIndex + index].squareValue
              === storeSingleton.currentGamer) {
      checkersNorthWestSouthEast++;
    } else {
      break;
    }
  }
  if (checkersNorthWestSouthEast === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }
  return false;
};

const isFourCheckerOfCurrentGamerOnNorthEastSouthWest: IsCurrentGamerWinType
      = (squareAdded: Square): boolean => {
  // DIAGONAL NORTH-EAST / SOUTH-WEST
  let checkersNorthEastSouthWest: number = 1;
  // Diagonal north-east of the squareAdded
  for (let index: number = 1 ; index < CHECKERS_ALIGN_TO_WIN ; index++) {
    if (squareAdded.columnIndex + index === GRID_COLUMN_LENGTH
          || squareAdded.rowIndex - index === -1) {
      break;
    }
    if (storeSingleton.grid[squareAdded.columnIndex + index]
          [squareAdded.rowIndex - index].squareValue
              === storeSingleton.currentGamer) {
      checkersNorthEastSouthWest++;
    } else {
      break;
    }
  }
  if (checkersNorthEastSouthWest === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }
  // Diagonal south-west of the squareAdded
  for (let index: number = 1 ; index < CHECKERS_ALIGN_TO_WIN ; index++) {
    if (squareAdded.columnIndex - index === -1
          || squareAdded.rowIndex + index === GRID_ROW_LENGTH) {
      break;
    }
    if (storeSingleton.grid[squareAdded.columnIndex - index]
          [squareAdded.rowIndex + index].squareValue
              === storeSingleton.currentGamer) {
      checkersNorthEastSouthWest++;
    } else {
      break;
    }
  }
  if (checkersNorthEastSouthWest === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }
  return false;
};

const isFourCheckerOfCurrentGamerOnSouth: IsCurrentGamerWinType
      = (squareAdded: Square): boolean => {
  let checkersSouth: number = 1;
  // Vertical, on the south of the squareAdded
  for (let rowIndex: number = squareAdded.rowIndex + 1;
      rowIndex < GRID_ROW_LENGTH ;
      rowIndex++) {
    if (storeSingleton.grid[squareAdded.columnIndex][rowIndex].squareValue
        === storeSingleton.currentGamer) {
      checkersSouth++;
    } else {
      break;
    }
  }
  if (checkersSouth === CHECKERS_ALIGN_TO_WIN) {
    return true;
  }
  return false;
};

export const IsCurrentGamerWin: IsCurrentGamerWinType
      = (squareAdded: Square): boolean => {
  if (isFourCheckerOfCurrentGamerHorizontally(squareAdded)) {
    return true;
  }
  if (isFourCheckerOfCurrentGamerOnNorthWestSouthEast(squareAdded)) {
    return true;
  }
  if (isFourCheckerOfCurrentGamerOnNorthEastSouthWest(squareAdded)) {
    return true;
  }
  if (isFourCheckerOfCurrentGamerOnSouth(squareAdded)) {
    return true;
  }
  return false;
};

// vim: ts=2 sw=2 et:
