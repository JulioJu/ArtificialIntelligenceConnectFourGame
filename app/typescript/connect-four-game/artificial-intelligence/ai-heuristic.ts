/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 09:24:13 AM CEST
  *       MODIFIED: Thu 28 Feb 2019 03:54:53 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../Square.js';
import { storeSingleton } from '../store-singleton.js';
import { IsGamerWin } from '../is-gamer-win.js';

import { HorizontalLeft, HorizontalRight }
  from '../loop-explore-grid-from-one-square/horizontal.js';
import { DiagonalNorthWest,
  DiagonalSouthEast }
  from '../loop-explore-grid-from-one-square/diagonal-north-west-south-east.js';
import { VerticalNorth, VerticalSouth }
  from '../loop-explore-grid-from-one-square/vertical.js';
import { DiagonalNorthEast,
  DiagonalSouthWest }
  from '../loop-explore-grid-from-one-square/diagonal-north-east-south-west.js';

import { ParseLineResult } from './ParseLineResult.js';
import { ParseWrap } from './ai-heuristic-wrap.js';

class BestSquare {
  public localScore: number = 0;
  public score: number = -1;
  public opponentIsTheWinnerFound: boolean = false;
  public square?: Square = undefined;
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

type parseLineCoreType = (
  heuristicCallback: heuristicCallbackType,
  squareParsed: Square,
  bestSquare: BestSquare) => boolean;
const parseSquare: parseLineCoreType =
      (
        heuristicCallback: heuristicCallbackType,
        squareParsed: Square,
        bestSquare: BestSquare
      ): boolean => {

  const parseLineResult: ParseLineResult =  heuristicCallback(squareParsed);
  // console.debug(parseLineResult);
  if (parseLineResult.gamerIsTheWinner) {
    return true;
  }

  if (parseLineResult.opponentIsTheWinner) {
    bestSquare.square = parseLineResult.square;
    // Better to try to avoid that the opponent will be the winner.
    bestSquare.opponentIsTheWinnerFound = true;
  }

  bestSquare.localScore += parseLineResult.score;

  return false;
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

    const bestSquare: BestSquare = new BestSquare();
    bestSquare.square = squaresEmptyPlayable[0];

    for (const square of squaresEmptyPlayable) {
      bestSquare.localScore = 0;
      if (heuristicCallback) {
        if (parseSquare(heuristicCallback, square, bestSquare)) {
          return square;
        }
      } else {
        // HERE, WE ARE NOT IN A CLOSURE, BECAUSE THE FUNCTION IS CALLED
        // WITHOUT PARAMS
        if (parseSquare(ParseHorizontally, square, bestSquare)) {
          return square;
        }
        if (parseSquare(ParseDiagnoalNorthWestSouthEast, square,
              bestSquare)) {
          return square;
        }
        if (parseSquare(ParseVertically, square, bestSquare)) {
          return square;
        }
        if (parseSquare(ParseDiagonalNorthEastSouthWest, square,
              bestSquare)) {
          return square;
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
      if (! bestSquare.opponentIsTheWinnerFound
            && bestSquare.localScore > bestSquare.score) {
        bestSquare.score = bestSquare.localScore;
        bestSquare.square = square;
      }
      console.debug('Current best square:',
            bestSquare.square.checkerHTMLElement,
        'Its score:', bestSquare.score,
        'opponentIsTheWinnerFound:', bestSquare.opponentIsTheWinnerFound
      );
    }
    return bestSquare.square;
  };

// vim: ts=2 sw=2 et:
