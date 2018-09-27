/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Thu 27 Sep 2018 08:00:30 AM CEST
 *       MODIFIED:
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { SquareValues } from './SquareValues.js';

export class Square {

  private _rowIndex: number;
  private _columnIndex: number;
  private _squareValue: SquareValues;

  public constructor (_rowIndex: number, _columnIndex: number,
    _squareValue: SquareValues) {
    this._rowIndex = _rowIndex;
    this._columnIndex = _columnIndex;
    this._squareValue = _squareValue;
  }

  public get rowIndex(): number {
    return this._rowIndex;
  }

  public set rowIndex(_rowIndex: number) {
    this._rowIndex = _rowIndex;
  }

  public get columnIndex(): number {
    return this._columnIndex;
  }

  public set columnIndex(_columnIndex: number) {
    this._columnIndex = _columnIndex;
  }

  public get squareValue(): SquareValues {
    return this._squareValue;
  }

  public set squareValue(_squareValue: SquareValues) {
    this._squareValue = _squareValue;
  }

}

// vim: ts=2 sw=2 et:
