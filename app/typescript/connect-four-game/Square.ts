/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Thu 27 Sep 2018 08:00:30 AM CEST
 *       MODIFIED: Fri 28 Sep 2018 03:06:28 PM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { Checker } from './constants.js';

export class Square {

  public constructor (private readonly _columnIndex: number,
    private readonly _rowIndex: number,
      private _squareValue: Checker,
      private readonly _checkerHTMLElement: HTMLElement) {
  }

  public get rowIndex(): number {
    return this._rowIndex;
  }

  public get columnIndex(): number {
    return this._columnIndex;
  }

  public get squareValue(): Checker {
    return this._squareValue;
  }

  public set squareValue(_squareValue: Checker) {
    this._squareValue = _squareValue;
  }

  public get checkerHTMLElement(): HTMLElement {
    return this._checkerHTMLElement;
  }

}

// vim: ts=2 sw=2 et:
