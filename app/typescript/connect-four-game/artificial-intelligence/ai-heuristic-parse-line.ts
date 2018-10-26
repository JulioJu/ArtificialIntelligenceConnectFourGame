/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 02:24:56 PM CEST
  *       MODIFIED: Fri 26 Oct 2018 12:22:58 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { CHECKERS_ALIGN_TO_WIN, Checker } from '../constants.js';
import { storeSingleton } from '../store-singleton.js';
import { Square } from '../Square.js';
import { ParseLineResult } from './ParseLineResult.js';
import { ParseLineResultBloc } from './ParseLineResultBloc.js';

const parseLineResultBlocBuild:
    (parseLineResultBloc: ParseLineResultBloc,
        squareOfLoop: Square,
        parseLineResult: ParseLineResult) => boolean
    = (parseLineResultBloc: ParseLineResultBloc,
        squareOfLoop: Square,
        parseLineResult: ParseLineResult): boolean => {

  const checkerOfLoop: Checker = squareOfLoop.squareValue;

  parseLineResultBloc.numberOfSquares++;
  if (checkerOfLoop !== Checker.EMPTY) {
    if (parseLineResultBloc.checkerWiner === Checker.EMPTY) {
      parseLineResultBloc.checkerWiner = checkerOfLoop;
    } else if (checkerOfLoop !== parseLineResultBloc.checkerWiner) {
      return false;
    }
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
      parseLineResult.score += 35;
    } else if (storeSingleton.currentGamer === checkerOfLoop) {
      parseLineResult.score += CHECKERS_ALIGN_TO_WIN
        // tslint:disable-next-line:no-magic-numbers
          - parseLineResultBloc.numberOfEmptySquare + 25;
    } else if (checkerOfLoop === Checker.EMPTY) {
      parseLineResult.score += CHECKERS_ALIGN_TO_WIN
          // tslint:disable-next-line:no-magic-numbers
          - parseLineResultBloc.numberOfEmptySquare + 20;
    } else {
      parseLineResult.score += CHECKERS_ALIGN_TO_WIN
          - parseLineResultBloc.numberOfEmptySquare + 1;
    }

  }

  if (!storeSingleton.squaresEmptyPlayableContains(squareOfLoop)) {
      console.debug('Square not playable tested: remove 2 points');
        // squareOfLoop.checkerHTMLElement);
      // tslint:disable-next-line:no-magic-numbers
      parseLineResult.score = parseLineResult.score - 2;
  }

  return false;
};

/** See explanations at ./ParseLineResult.ts */
export const ParseCurrentSquareOfTheLoop: (squareOfLoop: Square,
          parseLineResult: ParseLineResult,
          parseLineResultBloc: ParseLineResultBloc) => boolean
      =  (squareOfLoop: Square,
          parseLineResult: ParseLineResult,
          parseLineResultBloc: ParseLineResultBloc): boolean => {

  const checkerOfLoop: Checker = squareOfLoop.squareValue;

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

  if (parseLineResultBlocBuild(parseLineResultBloc, squareOfLoop,
          parseLineResult)) {
    return false;
  }

  return true;
};

// vim: ts=2 sw=2 et:
