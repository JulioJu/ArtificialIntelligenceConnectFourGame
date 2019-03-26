/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 02:24:56 PM CEST
  *       MODIFIED: Sun 31 Mar 2019 02:10:04 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { CHECKERS_ALIGN_TO_WIN, Checker } from '../../constants.js';
import { storeSingleton } from '../../store-singleton.js';
import { Square } from '../../Square.js';
import { LineResult } from './LineResult.js';
import { BlocResult } from './BlocResult.js';

const buildObjectBlocResult:
    (blocResult: BlocResult,
        squareOfLoop: Square,
        lineResult: LineResult) => boolean
    = (blocResult: BlocResult,
        squareOfLoop: Square,
        lineResult: LineResult): boolean => {

  const checkerOfLoop: Checker = squareOfLoop.squareValue;

  blocResult.numberOfSquares++;
  if (checkerOfLoop !== Checker.EMPTY) {
    if (blocResult.checkerWiner === Checker.EMPTY) {
      blocResult.checkerWiner = checkerOfLoop;
    } else if (checkerOfLoop !== blocResult.checkerWiner) {
      return false;
    }
  } else {
    blocResult.numberOfEmptySquare++;
  }

  if (!storeSingleton.squaresEmptyPlayableContains(squareOfLoop)) {
    blocResult.numberOfSquaresNotPlayable += 1;
  }

  if (blocResult.numberOfSquares === CHECKERS_ALIGN_TO_WIN) {

    // numberOfEmptySquare is instantated to 1
    if (blocResult.numberOfEmptySquare === 1) {
      if (storeSingleton.currentGamer === checkerOfLoop) {
        lineResult.gamerIsTheWinner = true;
        // Because no need to continue the analyze !
        // We know that if the current gamer add a checker it wins !!!
        return true;
      } else {
        lineResult.opponentIsTheWinner = true;
      }
    } else if (blocResult.numberOfEmptySquare ===
          // tslint:disable-next-line:no-magic-numbers
          CHECKERS_ALIGN_TO_WIN - 2) {
      // tslint:disable-next-line:no-magic-numbers
      lineResult.score += 35;
    } else if (storeSingleton.currentGamer === checkerOfLoop) {
      // tslint:disable-next-line:no-magic-numbers
      lineResult.score += 29 - blocResult.numberOfEmptySquare;
    } else if (checkerOfLoop === Checker.EMPTY) {
      // tslint:disable-next-line:no-magic-numbers
      lineResult.score += 24 - blocResult.numberOfEmptySquare;
    } else {
      // tslint:disable-next-line:no-magic-numbers
      lineResult.score += 5 - blocResult.numberOfEmptySquare ;
    }

    if (lineResult.score > -1) {
      // tslint:disable-next-line:no-magic-numbers
      lineResult.score -= blocResult.numberOfSquaresNotPlayable * 7;
    }

  }

  return false;
};

/** See explanations at ./LineResult.ts */
export const BuildBlocResultWrap: (squareOfLoop: Square,
          lineResult: LineResult,
          blocResult: BlocResult) => boolean
      =  (squareOfLoop: Square,
          lineResult: LineResult,
          blocResult: BlocResult): boolean => {

  const checkerOfLoop: Checker = squareOfLoop.squareValue;

  if (
    checkerOfLoop !== Checker.EMPTY
    && (
      lineResult.checkerAlreadyEncountredInThisSide !== Checker.EMPTY
      && checkerOfLoop !== lineResult.checkerAlreadyEncountredInThisSide
    )
  ) {
    return false;
  }

  if (
    checkerOfLoop !== Checker.EMPTY
    && lineResult.checkerAlreadyEncountredInThisSide === Checker.EMPTY
  ) {
    // Should be done one time by side
    lineResult.checkerAlreadyEncountredInThisSide = checkerOfLoop;
  }

  return ! buildObjectBlocResult(blocResult, squareOfLoop, lineResult);
};

// vim: ts=2 sw=2 et:
