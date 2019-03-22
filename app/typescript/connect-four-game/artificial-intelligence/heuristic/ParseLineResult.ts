/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 06 Oct 2018 06:21:24 PM CEST
  *       MODIFIED: Fri 22 Mar 2019 02:21:26 AM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */
import { Square } from '../../Square.js';
import { Checker } from '../../constants.js';

export enum Direction {
  HORIZONTAL, NORTH_WEST_SOUTH_EAST, NORTH_EAST_SOUTH_WEST, VERTICAL
}

/**
 *  This object is build thanks two loops. First loop if for a side
 *  of the Square, second loop is for the other side.
 */
export class ParseLineResult {

  /**
   *  It's the Square where the AI think about add a checker
   *  of the current gamer.
   *  It's the Square at the center of the analyse.
   *  Therefore the current object (`parseLineResult`)
   *  record the parse of the line with a length
   *  of `((CHECKERS_ALIGN_TO_WIN - 1) * 2)` around this Square.
   */
  private readonly _square: Square;

  /**
   *  Record the direction of the line parsed
   */
  private readonly _direction: Direction;

  /**
   *  Variable only used for build current object.
   *  During the loop that build the current object,
   *  ```
   *    if (checkerOfLoop !== Checker.EMPTY
   *        && checkerOfLoop
   *            !== parseLineResult.checkerAlreadyEncountredInThisSide)
   *  ```
   *  the loop that build the current object is breaked.
   *  Initialize at `Checker.EMPTY`
   * DO NOT FORGET TO INITIALIZE again at the start of each loop.
   *  legend: x === opponent / u === Checker.EMPTY
   *        o === storeSingleton.currentGamer
   * Stop in this configuration:
   * o x
   * x o
   * x u o
   * o u x
   * But no stop for:
   * u u x
   * x u u
   * etc.
   */
  private _checkerAlreadyEncountredInThisSide: Checker;

  /**
   * true if `this._checkersGamerAlignToWin === CHECKERS_ALIGN_TO_WIN`
   * IF `this._gamerIsTheWinner === true`
   * PARSE IS STOPPED AND CHECKER IS PLAYED
   */
  private _gamerIsTheWinner: boolean;

  /**
   * true if `this._checkersOpponentAlignToWin === CHECKERS_ALIGN_TO_WIN`
   */
  private _opponentIsTheWinner: boolean;

  private _score: number;

  public constructor (square: Square, direction: Direction) {
    this._square                              = square;
    this._direction                           = direction;

    this._checkerAlreadyEncountredInThisSide  = Checker.EMPTY;

    this._gamerIsTheWinner                    = false;

    this._opponentIsTheWinner                 = false;

    this._score                               = 0;
  }

  // Getters
  // ===================

  public get square(): Square {
    return this._square;
  }

  public get direction(): Direction {
    return this._direction;
  }

  // Getters and Setters
  // ===================

  // this.checkerAlreadyEncountredInThisSide

  public get checkerAlreadyEncountredInThisSide(): Checker {
    return this._checkerAlreadyEncountredInThisSide;
  }

  public set checkerAlreadyEncountredInThisSide(
    checkerAlreadyEncountredInThisSide: Checker) {
    this._checkerAlreadyEncountredInThisSide =
      checkerAlreadyEncountredInThisSide;
  }

  // this.gamerIsTheWinner

  public get gamerIsTheWinner(): boolean {
    return this._gamerIsTheWinner;
  }

  public set gamerIsTheWinner(gamerIsTheWinner: boolean) {
    this._gamerIsTheWinner = gamerIsTheWinner;
  }

  public get opponentIsTheWinner(): boolean {
    return this._opponentIsTheWinner;
  }

  public set opponentIsTheWinner(opponentIsTheWinner: boolean) {
    this._opponentIsTheWinner = opponentIsTheWinner;
  }

  // this.score

  public get score(): number {
    return this._score;
  }

  public set score(score: number) {
    this._score = score;
  }

}

// vim: ts=2 sw=2 et:
