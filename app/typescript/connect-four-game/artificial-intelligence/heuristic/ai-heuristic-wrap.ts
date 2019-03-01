/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 02:56:40 PM CEST
  *       MODIFIED: Fri 01 Mar 2019 04:22:59 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */
import { CHECKERS_ALIGN_TO_WIN, Checker }
  from '../../constants.js';
import { LoopExploreGridFromOneSquare }
  from
'../../loop-explore-grid-from-one-square/LoopExploreGridFromOneSquare.js';

import { Square } from '../../Square.js';
import { storeSingleton } from '../../store-singleton.js';
import { Direction, ParseLineResult }
  from './ParseLineResult.js';
import { ParseLineResultBloc } from './ParseLineResultBloc.js';
import { ParseCurrentSquareOfTheLoop } from './ai-heuristic-parse-line.js';

/** See explanations at ./ParseLineResult.ts */
export const ParseWrap: (
        square: Square,
        firstSideLoop: LoopExploreGridFromOneSquare,
        secondSideLoop: LoopExploreGridFromOneSquare) => ParseLineResult
      = (square: Square,
         firstSideLoop: LoopExploreGridFromOneSquare,
         secondSideLoop: LoopExploreGridFromOneSquare): ParseLineResult => {

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

    const squareOfLoop: Square =
      storeSingleton.grid[columnIndex][rowIndex];

    parseLineResultBloc.length++;
    parseLineResultBloc[parseLineResultBloc.length - 1] =
      new ParseLineResultBloc(
          // tslint:disable-next-line:no-magic-numbers
            parseLineResultBloc[parseLineResultBloc.length - 2]);
    if (!ParseCurrentSquareOfTheLoop(squareOfLoop, parseLineResult,
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

    const squareOfLoop: Square =
      storeSingleton.grid[columnIndex][rowIndex];

    for (let parseLineResultBlocIndex: number
              = parseLineResultBloc.length - 1;
          parseLineResultBlocIndex >= 0 ;
          parseLineResultBlocIndex--) {
      if (!ParseCurrentSquareOfTheLoop(squareOfLoop, parseLineResult,
        parseLineResultBloc[parseLineResultBlocIndex])) {
        return parseLineResult;
      }
    }

    if (parseLineResultBloc[parseLineResultBloc.length - 1].numberOfSquares
          === CHECKERS_ALIGN_TO_WIN && parseLineResultBloc.length > 1) {
      parseLineResultBloc.length--;
    }

  }

  return parseLineResult;
};

// vim: ts=2 sw=2 et:
