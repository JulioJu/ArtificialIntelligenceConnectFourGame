/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Fri 28 Sep 2018 09:07:45 AM CEST
  *       MODIFIED: Fri 05 Oct 2018 04:50:19 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

export const GRID_COLUMN_LENGTH: number = 7;
export const GRID_ROW_LENGTH: number = 6;
export const CHECKERS_ALIGN_TO_WIN: number = 4;
// Do not forget to change also time in connect-four-game.css, class `.checker`.

export enum GameMode { MULTIPLAYER, VSCOMPUTER, ONLY_COMPUTER }
export enum SquareChecker { EMPTY_SQUARE, GAMER_RED, GAMER_YELLOW }
export enum ComputerGamer { FIRST_GAMER, SECOND_GAMER }
// vim: ts=2 sw=2 et:
