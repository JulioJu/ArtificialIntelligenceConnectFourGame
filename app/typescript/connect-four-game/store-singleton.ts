/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 29 Sep 2018 03:38:08 PM CEST
  *       MODIFIED: Sun 30 Sep 2018 11:13:24 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from './Square.js';
import { GRID_COLUMN_LENGTH } from './constants.js';
import { SquareValues } from './SquareValues.js';

interface IStoreSingleton {
    currentGamer: SquareValues;
    numberOfClick: number;
    grid: Square[][];
}

export const storeSingleton: IStoreSingleton = {
    currentGamer: SquareValues.GAMER_RED,
    numberOfClick: 0,
    grid: new Array(GRID_COLUMN_LENGTH)
};
