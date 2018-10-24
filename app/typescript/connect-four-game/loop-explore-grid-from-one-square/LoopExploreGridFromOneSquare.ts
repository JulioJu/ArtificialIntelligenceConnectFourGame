/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 24 Oct 2018 11:44:30 AM CEST
  *       MODIFIED: Wed 24 Oct 2018 12:33:10 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

export class LoopExploreGridFromOneSquare {

  public constructor (
    private readonly _columnIndexInit: number,
    private readonly _rowIndexInit: number,
    private readonly _loopWhile:
        (columnIndex: number, rowIndex: number) => boolean,
    private readonly _columnIndexIncrement: (columnIndex: number) => number,
    private readonly _rowIndexIncrement: (rowIndex: number) => number
  ) {

  }

  public get columnIndexInit(): number {
    return this._columnIndexInit;
  }

  public get rowIndexInit(): number {
    return this._rowIndexInit;
  }

  public get loopWhile(): (columnIndex: number, rowIndex: number) => boolean {
    return this._loopWhile;
  }

  public get columnIndexIncrement(): (columnIndex: number) => number {
    return this._columnIndexIncrement;
  }

  public get rowIndexIncrement(): (rowIndex: number) => number {
    return this._rowIndexIncrement;
  }

}
