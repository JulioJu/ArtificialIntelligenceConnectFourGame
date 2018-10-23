/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 02:56:40 PM CEST
  *       MODIFIED: Tue 23 Oct 2018 12:37:32 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */
import { CHECKERS_ALIGN_TO_WIN, Checker }
  from '../constants.js';
import { Square } from '../Square.js';
import { storeSingleton } from '../store-singleton.js';
import { Direction, ParseLineResult }
  from './ParseLineResult.js';
import { ParseLineResultBloc } from './ParseLineResultBloc.js';
import { ParseCurrentSquareOfTheLoop } from './ai-heuristic-parse-line.js';

export class Loop {

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

/** See explanations at ./ParseLineResult.ts */
export const ParseWrap: (square: Square, firstSideLoop: Loop,
          secondSideLoop: Loop) => ParseLineResult
      = (square: Square, firstSideLoop: Loop, secondSideLoop: Loop):
            ParseLineResult => {

  const parseLineResult: ParseLineResult =
          new ParseLineResult(square, Direction.HORIZONTAL);

  const parseLineResultBloc: ParseLineResultBloc[] =
          new Array(1);

  parseLineResultBloc[0] = new ParseLineResultBloc();
  // First side of the Square
  // tslint:disable-next-line:one-variable-per-declaration
  for (let columnIndex: number = firstSideLoop.columnIndexInit,
          rowIndex: number = firstSideLoop.rowIndexInit ,
          loopIndex: number = 0 ;
      firstSideLoop.loopWhile(columnIndex, rowIndex)
          && loopIndex < CHECKERS_ALIGN_TO_WIN - 1;
      // tslint:disable-next-line:ban-comma-operator
      columnIndex = firstSideLoop.columnIndexIncrement(columnIndex),
          rowIndex = firstSideLoop.rowIndexIncrement(rowIndex),
          loopIndex++) {

    const checkerOfLoop: Checker =
      storeSingleton.grid[columnIndex][rowIndex].squareValue;

    parseLineResultBloc.length++;
    parseLineResultBloc[parseLineResultBloc.length - 1] =
      new ParseLineResultBloc(
          // tslint:disable-next-line:no-magic-numbers
            parseLineResultBloc[parseLineResultBloc.length - 2]);
    if (!ParseCurrentSquareOfTheLoop(checkerOfLoop, parseLineResult,
        parseLineResultBloc[parseLineResultBloc.length - 1])) {
      parseLineResultBloc.length--;
      break;
    }

  }
  if (parseLineResult.gamerIsTheWinner) {
    // Because no need to continue the analyze !
    // We know that if the current gamer add a checker it wins !!!
    return parseLineResult;
  }

  if (parseLineResultBloc.length === CHECKERS_ALIGN_TO_WIN) {
    parseLineResultBloc.length--;
  }

  // Second side of the Square
  // DO NOT FORGET TO INITIALIZE again some attributes;
  parseLineResult.checkerAlreadyEncountredInThisSide = Checker.EMPTY;
  // tslint:disable-next-line:one-variable-per-declaration
  for (let columnIndex: number = secondSideLoop.columnIndexInit,
          rowIndex: number = secondSideLoop.rowIndexInit ,
          loopIndex: number = 0 ;
      secondSideLoop.loopWhile(columnIndex, rowIndex)
          && loopIndex < CHECKERS_ALIGN_TO_WIN - 1;
      // tslint:disable-next-line:ban-comma-operator
      columnIndex = secondSideLoop.columnIndexIncrement(columnIndex),
          rowIndex = secondSideLoop.rowIndexIncrement(rowIndex),
          loopIndex++) {

    const checkerOfLoop: Checker =
        storeSingleton.grid[columnIndex][rowIndex].squareValue;

    for (let parseLineResultBlocIndex: number
              = parseLineResultBloc.length - 1;
          parseLineResultBlocIndex >= 0 ;
          parseLineResultBlocIndex--) {
      if (!ParseCurrentSquareOfTheLoop(checkerOfLoop, parseLineResult,
        parseLineResultBloc[parseLineResultBlocIndex])) {
        return parseLineResult;
      }
    }

    if (parseLineResultBloc[parseLineResultBloc.length - 1].numberOfSquares
          === CHECKERS_ALIGN_TO_WIN) {
      if (parseLineResultBloc.length > 1) {
        parseLineResultBloc.length--;
      }
    }

  }

  return parseLineResult;
};

// vim: ts=2 sw=2 et:
