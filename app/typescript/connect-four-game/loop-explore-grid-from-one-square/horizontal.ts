/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 24 Oct 2018 01:13:59 PM CEST
  *       MODIFIED: Wed 24 Oct 2018 01:26:28 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH } from '../constants.js';

import { Square } from '../Square.js';

import { LoopExploreGridFromOneSquare }
  from './LoopExploreGridFromOneSquare.js';

export const HorizontalLeft:
        (square: Square) => LoopExploreGridFromOneSquare
      = (square: Square): LoopExploreGridFromOneSquare =>
  new LoopExploreGridFromOneSquare (
    square.columnIndex - 1,
    square.rowIndex,
    // @ts-ignore:6133
    (columnIndex: number, rowIndex: number): boolean => columnIndex >= 0,
    (columnIndex: number): number => columnIndex - 1,
    (rowIndex: number): number => rowIndex
  );

export const HorizontalRight:
        (square: Square) => LoopExploreGridFromOneSquare
      = (square: Square): LoopExploreGridFromOneSquare =>
  new LoopExploreGridFromOneSquare (
    square.columnIndex + 1,
    square.rowIndex,
    // @ts-ignore:6133
    (columnIndex: number, rowIndex: number): boolean =>
        columnIndex < GRID_COLUMN_LENGTH,
    (columnIndex: number): number => columnIndex + 1,
    (rowIndex: number): number => rowIndex
  );

// vim: ts=2 sw=2 et:
