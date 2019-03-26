/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 09:24:13 AM CEST
  *       MODIFIED: Fri 05 Apr 2019 01:22:01 PM CEST
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

import { LineResult } from './LineResult.js';
import { HeuristicLine } from './heuristic-line.js';

export class BestSquare {
  public newTmpScore: number = 0;
  public score: number = -1;
  public opponentIsTheWinnerFound: boolean = false;
  public constructor (public square: Square) {}
}

type heuristicCallbackType =
  (square: Square) => LineResult;

export const ParseHorizontally: heuristicCallbackType
      = (square: Square): LineResult =>
  HeuristicLine(square,
    HorizontalLeft(square),
    HorizontalRight(square));

export const ParseDiagnoalNorthWestSouthEast: heuristicCallbackType
      = (square: Square): LineResult =>
  HeuristicLine(square,
    DiagonalNorthWest(square),
    DiagonalSouthEast(square));

export const ParseVertically: heuristicCallbackType
      = (square: Square): LineResult =>
  HeuristicLine(square,
    VerticalNorth(square),
    VerticalSouth(square));

export const ParseDiagonalNorthEastSouthWest: heuristicCallbackType
      = (square: Square): LineResult =>
  HeuristicLine(square,
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

  const lineResult: LineResult =  heuristicCallback(squareParsed);
  // console.debug(lineResult);

  // Used only in AIHeuristicLineClosure
  if (! calledFromAIDepthExplorationTurn && lineResult.gamerIsTheWinner) {
    bestSquare.square = lineResult.square;
    return true;
  }

  if (lineResult.opponentIsTheWinner) {
    // Used only in AIHeuristicLineClosure
    if (! calledFromAIDepthExplorationTurn) {
      bestSquare.square = lineResult.square;
    }
    bestSquare.opponentIsTheWinnerFound = true;
  }

  bestSquare.newTmpScore += lineResult.score;

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
      if (
        IsGamerWin(
          storeSingleton.grid[square.columnIndex][square.rowIndex - 1],
          storeSingleton.opponentGamer()
        )) {
        // Better to try to avoid that the opponent will be the winner.
        bestSquare.newTmpScore = -1;
        console.debug('Opponent will win if you play at:', square);
      } else if (
        IsGamerWin(
          storeSingleton.grid[square.columnIndex][square.rowIndex - 1],
          storeSingleton.currentGamer)
      ) {
        // tslint:disable-next-line:no-magic-numbers
        bestSquare.newTmpScore += 200;
        console.debug('Next turn, play above.');
      }
    }
  }
  console.debug('Square playable parsed:' , square.checkerHTMLElement,
    'Its score:', bestSquare.newTmpScore);
  if (bestSquare.opponentIsTheWinnerFound) {
    console.debug('The bestSquare stay because',
      ' we must avoid that the opponent will win', bestSquare);
  }
  if (
    ! bestSquare.opponentIsTheWinnerFound
    && bestSquare.newTmpScore > bestSquare.score
  ) {
    bestSquare.score = bestSquare.newTmpScore;
    bestSquare.square = square;
  }
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
    bestSquare.newTmpScore = 0;
    if (calledFromAIDepthExplorationTurn) {
      parseSquare(ParseHorizontally, square, bestSquare, true);
      parseSquare(ParseDiagnoalNorthWestSouthEast, square, bestSquare, true);
      parseSquare(ParseVertically, square, bestSquare, true);
      parseSquare(ParseDiagonalNorthEastSouthWest, square, bestSquare, true);
      if (bestSquare.newTmpScore > bestSquare.score
      ) {
        bestSquare.score = bestSquare.newTmpScore;
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
