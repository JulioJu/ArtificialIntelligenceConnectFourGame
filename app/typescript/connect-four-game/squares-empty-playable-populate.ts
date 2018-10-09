/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 29 Sep 2018 01:42:30 PM CEST
  *       MODIFIED: Sat 06 Oct 2018 11:27:02 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH, Checker }
    from './constants.js';
import { storeSingleton } from './store-singleton.js';
import { Square } from './Square.js';

export const PopulateSquareEmptyPlayables: () => Square[] = (): Square[] => {
  const squaresEmptyPlayable: Square[] = new Array<Square>(0);
  for (let columnIndex: number = GRID_COLUMN_LENGTH - 1 ;
    columnIndex >= 0 ;
    columnIndex--) {
    for (let rowIndex: number = GRID_ROW_LENGTH - 1;
      rowIndex >= 0 ;
      rowIndex--) {
      if (storeSingleton.grid[columnIndex][rowIndex].squareValue
            === Checker.EMPTY) {
        squaresEmptyPlayable.push(storeSingleton.grid[columnIndex][rowIndex]);
        break;
      }
    }
  }
  return squaresEmptyPlayable;
};

// vim: ts=2 sw=2 et:
