/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 09:24:13 AM CEST
  *       MODIFIED: Fri 22 Mar 2019 01:50:14 AM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../../Square.js';
import { storeSingleton } from '../../store-singleton.js';
import { IsGamerWin } from '../../is-gamer-win.js';

import { HorizontalLeft, HorizontalRight }
  from '../../loop-explore-grid-from-one-square/horizontal.js';
import {
  DiagonalNorthWest,
  DiagonalSouthEast
} from
  '../../loop-explore-grid-from-one-square/diagonal-north-west-south-east.js';
import { VerticalNorth, VerticalSouth }
  from '../../loop-explore-grid-from-one-square/vertical.js';
import {
  DiagonalNorthEast,
  DiagonalSouthWest
} from
  '../../loop-explore-grid-from-one-square/diagonal-north-east-south-west.js';

import { ParseLineResult } from './ParseLineResult.js';
import { ParseWrap } from './ai-heuristic-wrap.js';

export class BestSquare {
  public localScore: number = 0;
  public score: number = -1;
  public opponentIsTheWinnerFound: boolean = false;
  public constructor (public square: Square) {}
}

type heuristicCallbackType =
  (square: Square) => ParseLineResult;

export const ParseHorizontally: heuristicCallbackType
      = (square: Square): ParseLineResult =>
  ParseWrap(square,
    HorizontalLeft(square),
    HorizontalRight(square));

export const ParseDiagnoalNorthWestSouthEast: heuristicCallbackType
      = (square: Square): ParseLineResult =>
  ParseWrap(square,
    DiagonalNorthWest(square),
    DiagonalSouthEast(square));

export const ParseVertically: heuristicCallbackType
      = (square: Square): ParseLineResult =>
  ParseWrap(square,
    VerticalNorth(square),
    VerticalSouth(square));

export const ParseDiagonalNorthEastSouthWest: heuristicCallbackType
      = (square: Square): ParseLineResult =>
  ParseWrap(square,
    DiagonalNorthEast(square),
    DiagonalSouthWest(square));

/**
 *  @param calledFromAIDepthExplorationTurn
 *      true when caled in AIDepthExplorationTurn
 *      false when caled in AIHeuristicLineClosure
 */
const parseSquare = (
  heuristicCallback: heuristicCallbackType,
  squareParsed: Square,
  bestSquare: BestSquare,
  calledFromAIDepthExplorationTurn: boolean
): boolean => {

  const parseLineResult: ParseLineResult =  heuristicCallback(squareParsed);
  // console.debug(parseLineResult);

  // Used only in AIHeuristicLineClosure
  if (! calledFromAIDepthExplorationTurn && parseLineResult.gamerIsTheWinner) {
    bestSquare.square = parseLineResult.square;
    return true;
  }

  if (parseLineResult.opponentIsTheWinner) {
    // Used only in AIHeuristicLineClosure
    if (! calledFromAIDepthExplorationTurn) {
      bestSquare.square = parseLineResult.square;
    }
    bestSquare.opponentIsTheWinnerFound = true;
  }

  bestSquare.localScore += parseLineResult.score;

  return false;
};

const heuristicOnlyWithoutDeepSearch = (
  square: Square,
  bestSquare: BestSquare,
  heuristicCallback?: heuristicCallbackType
  ): boolean => {
  if (heuristicCallback) {
    if (parseSquare(
        heuristicCallback,
        square,
        bestSquare,
        false
    )) {
      return true;
    }
  } else {
    // HERE, WE ARE NOT IN A CLOSURE, BECAUSE THE FUNCTION IS CALLED
    // WITHOUT PARAMS
    if (parseSquare(ParseHorizontally, square, bestSquare, false)) {
      return true;
    }
    if (parseSquare(ParseDiagnoalNorthWestSouthEast, square,
      bestSquare, false)) {
      return true;
    }
    if (parseSquare(ParseVertically, square, bestSquare, false)) {
      return true;
    }
    if (parseSquare(ParseDiagonalNorthEastSouthWest, square,
      bestSquare, false)) {
      return true;
    }
    if (square.rowIndex - 1 >= 0) {
      if (IsGamerWin(
        storeSingleton.grid[square.columnIndex][square.rowIndex - 1],
        storeSingleton.opponentGamer())) {
        // Better to try to avoid that the opponent will be the winner.
        bestSquare.localScore = -1;
        console.debug('Opponent will win if you play at:', square);
      } else if (IsGamerWin(
        storeSingleton.grid[square.columnIndex][square.rowIndex - 1],
        storeSingleton.currentGamer)) {
        // tslint:disable-next-line:no-magic-numbers
        bestSquare.localScore += 200;
        console.debug('Next turn, play above.');
      }
    }
  }
  console.debug('Square playable parsed:' , square.checkerHTMLElement,
    'Its score:', bestSquare.localScore);
  if (
    ! bestSquare.opponentIsTheWinnerFound
    && bestSquare.localScore > bestSquare.score
  ) {
    bestSquare.score = bestSquare.localScore;
    bestSquare.square = square;
  }
  console.debug('Current best square:',
    bestSquare.square.checkerHTMLElement,
    'Its score:', bestSquare.score,
    'opponentIsTheWinnerFound:', bestSquare.opponentIsTheWinnerFound
  );
  return false;
};

/**
 *  @param calledFromAIDepthExplorationTurn
 *      true when caled in AIDepthExplorationTurn
 *      false when caled in AIHeuristicLineClosure
 *  @param heuristicCallback could be defined only in function
 *      AIHeuristicLineClosure.
 *      When called in function AIDepthExplorationTurn, never defined.
 */
export const AIHeuristicLineScore = (
  calledFromAIDepthExplorationTurn: boolean = true,
  heuristicCallback?: heuristicCallbackType
): BestSquare => {
  const squaresEmptyPlayable: Square[] =
    storeSingleton.squaresEmptyPlayable;

  const bestSquare: BestSquare = new BestSquare(squaresEmptyPlayable[0]);

  for (const square of squaresEmptyPlayable) {
    bestSquare.localScore = 0;
    if (calledFromAIDepthExplorationTurn) {
      parseSquare(ParseHorizontally, square, bestSquare, true);
      parseSquare(ParseDiagnoalNorthWestSouthEast, square, bestSquare, true);
      parseSquare(ParseVertically, square, bestSquare, true);
      parseSquare(ParseDiagonalNorthEastSouthWest, square, bestSquare, true);
      if (bestSquare.localScore > bestSquare.score
      ) {
        bestSquare.score = bestSquare.localScore;
        bestSquare.square = square;
      }
    } else {
      if (
        heuristicOnlyWithoutDeepSearch(
          square,
          bestSquare,
          heuristicCallback
        )
      ) {
        return bestSquare;
      }
    }
  }
  return bestSquare;
};

export const AIHeuristicLineClosure:
          (heuristicCallback?: heuristicCallbackType)
              => () => Square | undefined
      = (heuristicCallback?: heuristicCallbackType):
          () => Square | undefined =>
  (): Square | undefined => {
    const squaresEmptyPlayable: Square[] =
          storeSingleton.squaresEmptyPlayable;
    if (squaresEmptyPlayable.length === 0) {
      // https://en.wikipedia.org/wiki/Defensive_programming
      // Should never be triggered.
      return undefined;
    }
    const bestSquare: BestSquare =
      AIHeuristicLineScore(false, heuristicCallback);
    return bestSquare.square;
};
// vim: ts=2 sw=2 et:
