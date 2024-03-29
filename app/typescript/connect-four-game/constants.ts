/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Fri 28 Sep 2018 09:07:45 AM CEST
  *       MODIFIED: Tue 02 Apr 2019 02:43:20 PM CEST
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

export enum GameMode { MULTIGAMER, VSCOMPUTER, ONLY_COMPUTER }
export enum Checker { EMPTY, RED, YELLOW }
export enum ComputerGamer { FIRST_GAMER, SECOND_GAMER }
export enum ArtificialIntelligence {
    // RANDOM
    // ======
    RANDOM,

    // WIN LOST RANDOM
    // ======
    WIN_LOST_RANDOM,

    // HEURISTIC
    // =========
    HEURISTIC_HORIZONTAL,
    HEURISTIC_DIAGONAL_NORTH_EAST_SOUTH_WEST,
    HEURISTIC_VERTICAL,
    HEURISTIC_DIAGONAL_NORTH_WEST_SOUTH_EAST,
    HEURISTIC_HORIZONTAL_VERTICAL_DIAGONALS,

    // MINIMAX WITHOUT HEURISTIC
    // =========
    MINIMAXNOHEUR,

    // ALPHA-BETA PRUNING WITHOUT HEURISTIC
    // =======
    ALPHABETANOHEUR,

    // MINIMAX WITH HEURISTIC
    // =======
    MINIMAXHEUR,

    // ALPHA-BETA PRUNING WITH HEURISTIC
    // =======
    ALPHABETAHEUR
}

export const SCORE_WIN = 200000;

// vim: ts=2 sw=2 et:
