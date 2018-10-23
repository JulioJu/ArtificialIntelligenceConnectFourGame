/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 06 Oct 2018 06:09:31 PM CEST
  *       MODIFIED: Tue 23 Oct 2018 11:33:41 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH } from '../constants.js';
import { Square } from '../Square.js';
import { ParseLineResult } from './ParseLineResult.js';

import { Loop, ParseWrap } from './ai-heuristic-wrap.js';

/** See explanations at ./ParseLineResult.ts */
export const ParseHorizontally: (square: Square) => ParseLineResult
      = (square: Square): ParseLineResult => {

  const firstSideLoop: Loop = new Loop (
    square.columnIndex - 1,
    square.rowIndex,
    // @ts-ignore:6133
    (columnIndex: number, rowIndex: number): boolean => columnIndex >= 0,
    (columnIndex: number): number => columnIndex - 1,
    (rowIndex: number): number => rowIndex
  );

  const secondSideLoop: Loop = new Loop (
    square.columnIndex + 1,
    square.rowIndex,
    // @ts-ignore:6133
    (columnIndex: number, rowIndex: number): boolean =>
        columnIndex < GRID_COLUMN_LENGTH,
    (columnIndex: number): number => columnIndex + 1,
    (rowIndex: number): number => rowIndex
  );

  return ParseWrap(square, firstSideLoop, secondSideLoop);

};

// vim: ts=2 sw=2 et:
