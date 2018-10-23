/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 02:24:56 PM CEST
  *       MODIFIED: Tue 23 Oct 2018 12:44:50 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { CHECKERS_ALIGN_TO_WIN, Checker } from '../constants.js';
import { storeSingleton } from '../store-singleton.js';
import { ParseLineResult } from './ParseLineResult.js';
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
    } else if (parseLineResultBloc.numberOfEmptySquare ===
          // tslint:disable-next-line:no-magic-numbers
          CHECKERS_ALIGN_TO_WIN - 2) {
      // tslint:disable-next-line:no-magic-numbers
      parseLineResult.score += 25;
    } else if (storeSingleton.currentGamer === checkerOfLoop) {
      parseLineResult.score += CHECKERS_ALIGN_TO_WIN
        // tslint:disable-next-line:no-magic-numbers
          - parseLineResultBloc.numberOfEmptySquare + 15;
    } else if (checkerOfLoop === Checker.EMPTY) {
      parseLineResult.score += CHECKERS_ALIGN_TO_WIN
          // tslint:disable-next-line:no-magic-numbers
          - parseLineResultBloc.numberOfEmptySquare + 10;
    } else {
      parseLineResult.score += CHECKERS_ALIGN_TO_WIN
          - parseLineResultBloc.numberOfEmptySquare + 1;
    }
  }
  return false;
};

/** See explanations at ./ParseLineResult.ts */
export const ParseCurrentSquareOfTheLoop: (checkerOfLoop: Checker,
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
    // Should be done one time by side
    parseLineResult.checkerAlreadyEncountredInThisSide = checkerOfLoop;
  }

  if (parseLineResultBlocBuild(parseLineResultBloc, checkerOfLoop,
          parseLineResult)) {
    return false;
  }

  return true;
};

// vim: ts=2 sw=2 et:
