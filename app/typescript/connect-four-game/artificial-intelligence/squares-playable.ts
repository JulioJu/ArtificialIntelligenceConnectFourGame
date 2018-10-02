/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 29 Sep 2018 01:42:30 PM CEST
  *       MODIFIED: Tue 02 Oct 2018 07:44:58 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH } from '../constants.js';
import { storeSingleton } from '../store-singleton.js';
import { Square } from '../Square.js';
import { SquareValues } from '../SquareValues.js';

export const SquarePlayable: () => Square[] = (): Square[] => {
  const squarePlayable: Square[] = new Array(GRID_COLUMN_LENGTH);
  let squarePlayableIndex: number = 0;
  for (let columnIndex: number = GRID_COLUMN_LENGTH - 1 ;
    columnIndex >= 0 ;
    columnIndex--) {
    for (let rowIndex: number = GRID_ROW_LENGTH - 1;
      rowIndex >= 0 ;
      rowIndex--) {
      if (storeSingleton.grid[columnIndex][rowIndex].squareValue
            === SquareValues.EMPTY_SQUARE) {
        squarePlayable[squarePlayableIndex] =
          storeSingleton.grid[columnIndex][rowIndex];
        squarePlayableIndex++;
        break;
      }
    }
  }
  return squarePlayable;
  };

// vim: ts=2 sw=2 et:
