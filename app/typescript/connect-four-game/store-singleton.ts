/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 29 Sep 2018 03:38:08 PM CEST
  *       MODIFIED: Thu 04 Oct 2018 07:33:25 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GameMode, SquareChecker } from './constants.js';
import { Square } from './Square.js';

interface IStoreSingleton {
    currentGamer: SquareChecker;
    numberOfClick: number;
    grid: Square[][];
    gameMode: GameMode;
    isComputerToPlay: boolean;
}

export const storeSingleton: IStoreSingleton = {
    currentGamer: SquareChecker.GAMER_RED,
    numberOfClick: 0,
    grid: new Array(GRID_COLUMN_LENGTH),
    gameMode: GameMode.MULTIPLAYER,
    isComputerToPlay: false
};
