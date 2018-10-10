/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 06 Oct 2018 06:09:31 PM CEST
  *       MODIFIED: Wed 10 Oct 2018 07:13:05 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, CHECKERS_ALIGN_TO_WIN, Checker }
  from '../constants.js';
import { Square } from '../Square.js';
import { storeSingleton } from '../store-singleton.js';
import { Direction, ParseLineResult }
  from './ParseLineResult.js';
import { ParseLineResultBloc } from './ParseLineResultBloc.js';

const parseLineResultBlocBuild:
    (parseLineResultBloc: ParseLineResultBloc,
        checkerOfLoop: Checker,
        parseLineResult: ParseLineResult) => boolean
    = (parseLineResultBloc: ParseLineResultBloc,
        checkerOfLoop: Checker,
        parseLineResult: ParseLineResult): boolean => {

  parseLineResultBloc.numberOfSquares++;
  if (checkerOfLoop !== Checker.EMPTY) {
    parseLineResultBloc.checkerWiner = checkerOfLoop;
  } else {
    parseLineResultBloc.numberOfEmptySquare++;
  }
  if (parseLineResultBloc.numberOfSquares === CHECKERS_ALIGN_TO_WIN) {
    if (parseLineResultBloc.numberOfEmptySquare === 1) {
      if (storeSingleton.currentGamer === checkerOfLoop) {
        parseLineResult.gamerIsTheWinner = true;
        // Because no need to continue the analyze !
        // We know that if the current gamer add a checker it wins !!!
        return true;
      } else {
        parseLineResult.opponentIsTheWinner = true;
      }
    } else {
      if (storeSingleton.currentGamer === checkerOfLoop) {
        parseLineResult.score += CHECKERS_ALIGN_TO_WIN
          // tslint:disable-next-line:no-magic-numbers
          - parseLineResultBloc.numberOfEmptySquare + 3;
      } else if (checkerOfLoop === Checker.EMPTY) {
        parseLineResult.score += CHECKERS_ALIGN_TO_WIN
          // tslint:disable-next-line:no-magic-numbers
          - parseLineResultBloc.numberOfEmptySquare + 5;
      } else {
        parseLineResult.score += CHECKERS_ALIGN_TO_WIN
          - parseLineResultBloc.numberOfEmptySquare + 1;
      }
    }
  }
  return false;
};

/** See explanations at ./ParseLineResult.ts */
const parseCurrentSquareOfTheLoop: (checkerOfLoop: Checker,
          parseLineResult: ParseLineResult,
          parseLineResultBloc: ParseLineResultBloc) => boolean
      =  (checkerOfLoop: Checker,
          parseLineResult: ParseLineResult,
          parseLineResultBloc: ParseLineResultBloc): boolean => {

  if (checkerOfLoop !== Checker.EMPTY
      && (parseLineResult.checkerAlreadyEncountredInThisSide
              !== Checker.EMPTY
          && checkerOfLoop
            !== parseLineResult.checkerAlreadyEncountredInThisSide)) {
    return false;
  }

  if (checkerOfLoop !== Checker.EMPTY
      && parseLineResult.checkerAlreadyEncountredInThisSide
          === Checker.EMPTY) {
    // Should be done one time by bloc
    parseLineResult.checkerAlreadyEncountredInThisSide = checkerOfLoop;
  }

  if (parseLineResultBlocBuild(parseLineResultBloc, checkerOfLoop,
          parseLineResult)) {
    return false;
  }

  return true;
};

/** See explanations at ./ParseLineResult.ts */
export const parseHorizontally: (square: Square) => ParseLineResult
      = (square: Square): ParseLineResult => {

  const parseLineResult: ParseLineResult =
          new ParseLineResult(square, Direction.HORIZONTAL);

  const parseLineResultBloc: ParseLineResultBloc[] =
          new Array(1);

  parseLineResultBloc[0] = new ParseLineResultBloc();
  // Horizontal, on the west of the square
  // tslint:disable-next-line:one-variable-per-declaration
  for (let columnIndex: number = square.columnIndex - 1,
          loopIndex: number = 0 ;
      columnIndex >= 0
          && loopIndex < CHECKERS_ALIGN_TO_WIN - 1;
      // tslint:disable-next-line:ban-comma-operator
      columnIndex--, loopIndex++) {
    const checkerOfLoop: Checker =
      storeSingleton.grid[columnIndex][square.rowIndex].squareValue;
    parseLineResultBloc.length++;
    parseLineResultBloc[parseLineResultBloc.length - 1] =
      new ParseLineResultBloc(
          // tslint:disable-next-line:no-magic-numbers
            parseLineResultBloc[parseLineResultBloc.length - 2]);
    if (!parseCurrentSquareOfTheLoop(checkerOfLoop, parseLineResult,
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

  // Horizontal, on the east of the square
  // DO NOT FORGET TO INITIALIZE again some attributes;
  parseLineResult.checkerAlreadyEncountredInThisSide = Checker.EMPTY;
  // tslint:disable-next-line:one-variable-per-declaration
  for (let columnIndex: number = square.columnIndex + 1,
          loopIndex: number = 0;
      columnIndex < GRID_COLUMN_LENGTH
          && loopIndex < CHECKERS_ALIGN_TO_WIN - 1 ;
      // tslint:disable-next-line:ban-comma-operator
      columnIndex++, loopIndex++) {
    const checkerOfLoop: Checker =
        storeSingleton.grid[columnIndex][square.rowIndex].squareValue;
    for (let parseLineResultBlocIndex: number
              = parseLineResultBloc.length - 1;
          parseLineResultBlocIndex >= 0 ;
          parseLineResultBlocIndex--) {
      if (!parseCurrentSquareOfTheLoop(checkerOfLoop, parseLineResult,
        parseLineResultBloc[parseLineResultBlocIndex])) {
        break;
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
