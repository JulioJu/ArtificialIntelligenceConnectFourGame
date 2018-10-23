/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Fri 28 Sep 2018 09:07:45 AM CEST
  *       MODIFIED: Tue 23 Oct 2018 05:07:57 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

export const GRID_COLUMN_LENGTH: number     = 7;
export const GRID_ROW_LENGTH: number        = 6;
export const CHECKERS_ALIGN_TO_WIN: number  = 4;
// Do not forget to change also time in connect-four-game.css, class `.checker`.

export enum GameMode { MULTIPLAYER, VSCOMPUTER, ONLY_COMPUTER }
export enum Checker { EMPTY, RED, YELLOW }
export enum ComputerGamer { FIRST_GAMER, SECOND_GAMER }
export enum ArtificialIntelligence {
    RANDOM,
    HEURISTIC_ROW,
    HEURISTIC_DIAGONAL_NORTH_EAST_SOUTH_WEST,
    HEURISTIC_COLUMN,
    HEURISTIC_DIAGONAL_NORTH_WEST_SOUTH_EAST
}

// vim: ts=2 sw=2 et:
