/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 08 Oct 2018 02:17:06 PM CEST
  *       MODIFIED: Fri 26 Oct 2018 12:50:43 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Checker } from '../../constants.js';

/**
 *  Always instantiated in an array of length 4. But sometimes zero could be
 *  winable and sometimes only one could contain four checkers.
 */
export class BlocResult {

  /**
   *  legend: x === opponent / u === Checker.EMPTY
   *        o === storeSingleton.currentGamer
   *
   *  If `_checkerWiner === Checker.EMPTY`
   *  the gamer Checker.RED and Checker.YELLOW
   *  could win in this block.
   *  It's only when `this._numberOfEmptySquare === CHECKERS_ALIGN_TO_WIN`
   *  e.g. of disposition: u u u u
   *
   *  If `_checkerWiner === Checker.RED`, only this gamer
   *  could game in this square.
   *  If `_checkerWiner === Checker.YELLOW`, only this gamer
   *  could game in this square.
   *  e.g. of dispositions:
   * ```
   * x x u u
   * u x u x
   *
   */
  private _checkerWiner: Checker;

  private _numberOfEmptySquare: number;

  private _numberOfSquaresNotPlayable: number;

  /**
   *  Number between 1 and CHECKERS_ALIGN_TO_WIN
   *  A block is winable only if this._numberOfSquares === CHECKERS_ALIGN_TO_WIN
   */
  private _numberOfSquares: number;

  public constructor(blocResult?: BlocResult) {
    if (blocResult) {
      this._checkerWiner         = blocResult.checkerWiner;
      this._numberOfEmptySquare  = blocResult.numberOfEmptySquare;
      this._numberOfSquares      = blocResult.numberOfSquares;
      this._numberOfSquaresNotPlayable =
        blocResult.numberOfSquaresNotPlayable;
    } else {
      this._checkerWiner                = Checker.EMPTY;
      /** The square we want maybe add a new checker is empty */
      this._numberOfEmptySquare         = 1;
      this._numberOfSquares             = 1;

      this._numberOfSquaresNotPlayable  = 0;
    }
  }

  public get checkerWiner(): Checker {
    return this._checkerWiner;
  }

  public set checkerWiner(checkerWiner: Checker) {
    this._checkerWiner = checkerWiner;
  }

  public get numberOfEmptySquare(): number {
    return this._numberOfEmptySquare;
  }

  public set numberOfEmptySquare(numberOfEmptySquare: number) {
    this._numberOfEmptySquare = numberOfEmptySquare;
  }

  public get numberOfSquares(): number {
    return this._numberOfSquares;
  }

  public set numberOfSquares(numberOfSquares: number) {
    this._numberOfSquares = numberOfSquares;
  }

  public get numberOfSquaresNotPlayable(): number {
    return this._numberOfSquaresNotPlayable;
  }

  public set numberOfSquaresNotPlayable(numberOfSquaresNotPlayable: number) {
    this._numberOfSquaresNotPlayable = numberOfSquaresNotPlayable;
  }
}

// vim: ts=2 sw=2 et:
