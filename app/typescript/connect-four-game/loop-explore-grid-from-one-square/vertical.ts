/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 24 Oct 2018 01:17:58 PM CEST
  *       MODIFIED: Wed 24 Oct 2018 01:25:17 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH } from '../constants.js';

import { Square } from '../Square.js';

import { LoopExploreGridFromOneSquare }
  from './LoopExploreGridFromOneSquare.js';

export const VerticalNorth:
        (square: Square) => LoopExploreGridFromOneSquare
      = (square: Square): LoopExploreGridFromOneSquare =>
  new LoopExploreGridFromOneSquare (
      square.columnIndex,
      square.rowIndex - 1,
      // @ts-ignore:6133
      (columnIndex: number, rowIndex: number): boolean => rowIndex >= 0,
      (columnIndex: number): number => columnIndex,
      (rowIndex: number): number => rowIndex - 1
  );

export const VerticalSouth:
        (square: Square) => LoopExploreGridFromOneSquare
      = (square: Square): LoopExploreGridFromOneSquare =>
  new LoopExploreGridFromOneSquare (
    square.columnIndex,
    square.rowIndex + 1,
    // @ts-ignore:6133
    (columnIndex: number, rowIndex: number): boolean =>
        rowIndex < GRID_ROW_LENGTH,
    (columnIndex: number): number => columnIndex,
    (rowIndex: number): number => rowIndex + 1
  );

// vim: ts=2 sw=2 et:
