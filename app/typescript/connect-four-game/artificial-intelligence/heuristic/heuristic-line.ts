/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 02:56:40 PM CEST
  *       MODIFIED: Sat 30 Mar 2019 03:14:24 PM CET
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
import { Direction, LineResult }
  from './LineResult.js';
import { BlocResult } from './BlocResult.js';
import { BuildBlocResultWrap } from './build-BlocResult.js';

/** See explanations at ./LineResult.ts */
export const HeuristicLine: (
        square: Square,
        firstSideLoop: LoopExploreGridFromOneSquare,
        secondSideLoop: LoopExploreGridFromOneSquare) => LineResult
      = (square: Square,
         firstSideLoop: LoopExploreGridFromOneSquare,
         secondSideLoop: LoopExploreGridFromOneSquare): LineResult => {

  const lineResult: LineResult = new LineResult(square, Direction.HORIZONTAL);

  const blocResult: BlocResult[] = new Array(1);

  blocResult[0] = new BlocResult();
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

    const squareOfLoop: Square = storeSingleton.grid[columnIndex][rowIndex];

    blocResult.length++;
    blocResult[blocResult.length - 1] =
      // tslint:disable-next-line:no-magic-numbers
      new BlocResult(blocResult[blocResult.length - 2]);
    if (!BuildBlocResultWrap(squareOfLoop, lineResult,
        blocResult[blocResult.length - 1])) {
      blocResult.length--;
      break;
    }

  }
  if (lineResult.gamerIsTheWinner) {
    // Because no need to continue the analyze !
    // We know that if the current gamer add a checker it wins !!!
    return lineResult;
  }

  if (blocResult.length === CHECKERS_ALIGN_TO_WIN) {
    blocResult.length--;
  }

  // Second side of the Square
  // DO NOT FORGET TO INITIALIZE again some attributes;
  lineResult.checkerAlreadyEncountredInThisSide = Checker.EMPTY;
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

    for (let blocResultIndex: number
              = blocResult.length - 1;
          blocResultIndex >= 0 ;
          blocResultIndex--) {
      if (!BuildBlocResultWrap(squareOfLoop, lineResult,
        blocResult[blocResultIndex])) {
        return lineResult;
      }
    }

    if (blocResult[blocResult.length - 1].numberOfSquares
          === CHECKERS_ALIGN_TO_WIN && blocResult.length > 1) {
      blocResult.length--;
    }

  }

  return lineResult;
};

// vim: ts=2 sw=2 et:
