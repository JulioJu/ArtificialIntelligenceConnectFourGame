/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 02:43:46 PM CEST
  *       MODIFIED: Tue 23 Oct 2018 11:33:41 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_ROW_LENGTH } from '../constants.js';
import { Square } from '../Square.js';
import { ParseLineResult } from './ParseLineResult.js';

import { Loop, ParseWrap } from './ai-heuristic-wrap.js';

/** See explanations at ./ParseLineResult.ts */
export const ParseVertically: (square: Square) => ParseLineResult
      = (square: Square): ParseLineResult => {

  const firstSideLoop: Loop = new Loop (
    square.columnIndex,
    square.rowIndex - 1,
    // @ts-ignore:6133
    (columnIndex: number, rowIndex: number): boolean => rowIndex >= 0,
    (columnIndex: number): number => columnIndex,
    (rowIndex: number): number => rowIndex - 1
  );

  const secondSideLoop: Loop = new Loop (
    square.columnIndex,
    square.rowIndex + 1,
    // @ts-ignore:6133
    (columnIndex: number, rowIndex: number): boolean =>
        rowIndex < GRID_ROW_LENGTH,
    (columnIndex: number): number => columnIndex,
    (rowIndex: number): number => rowIndex + 1
  );

  return ParseWrap(square, firstSideLoop, secondSideLoop);

};

// vim: ts=2 sw=2 et:
