/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Thu 27 Sep 2018 08:00:30 AM CEST
 *       MODIFIED: Fri 28 Sep 2018 12:01:33 PM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { SquareValues } from './SquareValues.js';

export class Square {

  public constructor (private readonly _columnIndex: number,
    private readonly _rowIndex: number,
      private _squareValue: SquareValues,
      private readonly _squareHTMLElement: HTMLElement) {
  }

  public get rowIndex(): number {
    return this._rowIndex;
  }

  public get columnIndex(): number {
    return this._columnIndex;
  }

  public get squareValue(): SquareValues {
    return this._squareValue;
  }

  public set squareValue(_squareValue: SquareValues) {
    this._squareValue = _squareValue;
  }

  public get squareHTMLElement(): HTMLElement {
    return this._squareHTMLElement;
  }

}

// vim: ts=2 sw=2 et:
