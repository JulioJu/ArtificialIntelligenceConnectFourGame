/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Fri 28 Sep 2018 09:06:49 AM CEST
  *       MODIFIED: Fri 28 Sep 2018 11:23:45 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH, CHECKERS_ALIGN_TO_WIN }
  from './constants.js';
import { Square } from './Square.js';
import { SquareValues } from './SquareValues.js';

const isFourCheckerOfCurrentGamerHorizontally:
    (currentGamer: SquareValues, grid: Square[][], squareAdded: Square)
            => boolean
        = (currentGamer: SquareValues, grid: Square[][], squareAdded: Square):
            boolean => {
  let checkersHorizontal: number = 1;
  // Horizontal, on the east of the squareAdded
  for (let columnIndex: number = squareAdded.columnIndex + 1;
      columnIndex < GRID_COLUMN_LENGTH ;
      columnIndex++) {
    if (grid[columnIndex][squareAdded.rowIndex].squareValue === currentGamer) {
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
    if (grid[columnIndex][squareAdded.rowIndex].squareValue === currentGamer) {
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

const isFourCheckerOfCurrentGamerOnNorthWestSouthEast:
    (currentGamer: SquareValues, grid: Square[][], squareAdded: Square)
            => boolean
        = (currentGamer: SquareValues, grid: Square[][], squareAdded: Square):
            boolean => {
  // DIAGONAL NORTH-WEST / SOUTH-EAST
  let checkersNorthWestSouthEast: number = 1;
  // Diagonal north-west of the squareAdded
  for (let index: number = 1 ; index < CHECKERS_ALIGN_TO_WIN ; index++) {
    if (squareAdded.columnIndex - index === -1
          || squareAdded.rowIndex - index === -1) {
      break;
    }
    if (grid[squareAdded.columnIndex - index][squareAdded.rowIndex - index]
          .squareValue === currentGamer) {
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
    if (grid[squareAdded.columnIndex + index][squareAdded.rowIndex + index]
          .squareValue === currentGamer) {
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

const isFourCheckerOfCurrentGamerOnNorthEastSouthWest:
    (currentGamer: SquareValues, grid: Square[][], squareAdded: Square)
            => boolean
        = (currentGamer: SquareValues, grid: Square[][], squareAdded: Square):
            boolean => {
  // DIAGONAL NORTH-EAST / SOUTH-WEST
  let checkersNorthEastSouthWest: number = 1;
  // Diagonal north-east of the squareAdded
  for (let index: number = 1 ; index < CHECKERS_ALIGN_TO_WIN ; index++) {
    if (squareAdded.columnIndex + index === GRID_COLUMN_LENGTH
          || squareAdded.rowIndex - index === -1) {
      break;
    }
    if (grid[squareAdded.columnIndex + index][squareAdded.rowIndex - index]
          .squareValue === currentGamer) {
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
    if (grid[squareAdded.columnIndex - index][squareAdded.rowIndex + index]
          .squareValue === currentGamer) {
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

const isFourCheckerOfCurrentGamerOnSouth:
    (currentGamer: SquareValues, grid: Square[][], squareAdded: Square)
            => boolean
        = (currentGamer: SquareValues, grid: Square[][], squareAdded: Square):
            boolean => {
  let checkersSouth: number = 1;
  // Vertical, on the south of the squareAdded
  for (let rowIndex: number = squareAdded.rowIndex + 1;
      rowIndex < GRID_ROW_LENGTH ;
      rowIndex++) {
    if (grid[squareAdded.columnIndex][rowIndex].squareValue === currentGamer) {
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

export const IsCurrentGamerWin:
    (currentGamer: SquareValues, grid: Square[][], squareAdded: Square)
            => boolean
        = (currentGamer: SquareValues, grid: Square[][], squareAdded: Square):
            boolean => {
  if (isFourCheckerOfCurrentGamerHorizontally(currentGamer, grid,
        squareAdded)) {
    return true;
  }
  if (isFourCheckerOfCurrentGamerOnNorthWestSouthEast(currentGamer, grid,
        squareAdded)) {
    return true;
  }
  if (isFourCheckerOfCurrentGamerOnNorthEastSouthWest(currentGamer, grid,
        squareAdded)) {
    return true;
  }
  if (isFourCheckerOfCurrentGamerOnSouth(currentGamer, grid,
        squareAdded)) {
    return true;
  }
  return false;
};

// vim: ts=2 sw=2 et:
