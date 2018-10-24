/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Tue 23 Oct 2018 05:20:57 PM CEST
  *       MODIFIED: Wed 24 Oct 2018 11:56:12 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH } from '../constants.js';
import { Square } from '../Square.js';
import { LoopExploreGridFromOneSquare }
  from '../LoopExploreGridFromOneSquare.js';

import { ParseLineResult } from './ParseLineResult.js';
import { ParseWrap } from './ai-heuristic-wrap.js';

/** See explanations at ./ParseLineResult.ts */
export const ParseDiagonalNorthEastSouthWest:
        (square: Square) => ParseLineResult
      = (square: Square): ParseLineResult => {

  const firstSideLoop: LoopExploreGridFromOneSquare
          = new LoopExploreGridFromOneSquare (
    square.columnIndex + 1,
    square.rowIndex - 1,
    (columnIndex: number, rowIndex: number): boolean =>
      columnIndex < GRID_COLUMN_LENGTH && rowIndex >= 0,
    (columnIndex: number): number => columnIndex + 1,
    (rowIndex: number): number => rowIndex - 1
  );

  const secondSideLoop: LoopExploreGridFromOneSquare
          = new LoopExploreGridFromOneSquare (
    square.columnIndex - 1,
    square.rowIndex + 1,
    (columnIndex: number, rowIndex: number): boolean =>
      columnIndex >= 0 && rowIndex < GRID_ROW_LENGTH,
    (columnIndex: number): number => columnIndex - 1,
    (rowIndex: number): number => rowIndex + 1
  );

  return ParseWrap(square, firstSideLoop, secondSideLoop);

};

// vim: ts=2 sw=2 et:
