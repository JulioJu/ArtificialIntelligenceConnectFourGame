/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 24 Oct 2018 01:42:26 PM CEST
  *       MODIFIED: Wed 24 Oct 2018 01:44:07 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH } from '../constants.js';

import { Square } from '../Square.js';

import { LoopExploreGridFromOneSquare }
  from './LoopExploreGridFromOneSquare.js';

export const DiagonalNorthEast:
        (square: Square) => LoopExploreGridFromOneSquare
      = (square: Square): LoopExploreGridFromOneSquare =>
  new LoopExploreGridFromOneSquare (
    square.columnIndex + 1,
    square.rowIndex - 1,
    (columnIndex: number, rowIndex: number): boolean =>
      columnIndex < GRID_COLUMN_LENGTH && rowIndex >= 0,
    (columnIndex: number): number => columnIndex + 1,
    (rowIndex: number): number => rowIndex - 1
  );

export const DiagonalSouthWest:
        (square: Square) => LoopExploreGridFromOneSquare
      = (square: Square): LoopExploreGridFromOneSquare =>
  new LoopExploreGridFromOneSquare (
    square.columnIndex - 1,
    square.rowIndex + 1,
    (columnIndex: number, rowIndex: number): boolean =>
      columnIndex >= 0 && rowIndex < GRID_ROW_LENGTH,
    (columnIndex: number): number => columnIndex - 1,
    (rowIndex: number): number => rowIndex + 1
  );

// vim: ts=2 sw=2 et:
