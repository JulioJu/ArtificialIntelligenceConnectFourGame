/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 09:24:13 AM CEST
  *       MODIFIED: Wed 24 Oct 2018 02:54:33 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../Square.js';
import { storeSingleton } from '../store-singleton.js';

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

type heuristicCallbackType = (square: Square) => ParseLineResult;

const bestSquare: { localScore: number;
                    score: number;
                    opponentIsTheWinnerFound: boolean;
                    square: Square | undefined;
                } = {
  localScore: 0,
  score: -1,
  opponentIsTheWinnerFound: false,
  square: undefined
};

type parseLineCorePromiseType = (
  heuristicCallback: heuristicCallbackType,
  squareParsed: Square) => boolean;
const parseSquare: parseLineCorePromiseType =
      (
        heuristicCallback: heuristicCallbackType,
        squareParsed: Square
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

export const ParseHorizontally: (square: Square) => ParseLineResult
      = (square: Square): ParseLineResult =>
  ParseWrap(square,
    HorizontalLeft(square),
    HorizontalRight(square));

export const ParseDiagnoalNorthWestSouthEast: (square: Square)
          => ParseLineResult
      = (square: Square): ParseLineResult =>
  ParseWrap(square,
    DiagonalNorthWest(square),
    DiagonalSouthEast(square));

export const ParseVertically: (square: Square) => ParseLineResult
      = (square: Square): ParseLineResult =>
  ParseWrap(square,
    VerticalNorth(square),
    VerticalSouth(square));

export const ParseDiagonalNorthEastSouthWest: (square: Square)
          => ParseLineResult
      = (square: Square): ParseLineResult =>
  ParseWrap(square,
    DiagonalNorthEast(square),
    DiagonalSouthWest(square));

export const AIHeuristicLineClosure:
          (heuristicCallback?: heuristicCallbackType)
              => () => Promise<Square>
      = (heuristicCallback?: heuristicCallbackType):
          () => Promise<Square> => {

  const promiseReturn: () => Promise<Square>
        = async (): Promise<Square> => new Promise(
    (
      resolve: (square: Square) => void,
      reject: (drawnMatches: Error) => void
    ): void => {
      const squaresEmptyPlayable: Square[] =
            storeSingleton.squaresEmptyPlayable;
      if (squaresEmptyPlayable.length === 0) {
        // https://en.wikipedia.org/wiki/Defensive_programming
        // Should never be triggered.
        reject(new Error('Drawn matches'));
      }

      // Always reassign, because score = -1;
      bestSquare.square = squaresEmptyPlayable[0];

      for (const square of squaresEmptyPlayable) {
        bestSquare.localScore = 0;
        if (heuristicCallback) {
          if (parseSquare(heuristicCallback, square)) {
            resolve(square);
          }
        } else {
          // HERE, WE ARE NOT IN A CLOSURE, BECAUSE THE FUNCTION IS CALLED
          // WITHOUT PARAMS
          if (parseSquare(ParseHorizontally, square)) {
            resolve(square);
          }
          if (parseSquare(ParseDiagnoalNorthWestSouthEast, square)) {
            resolve(square);
          }
          if (parseSquare(ParseVertically, square)) {
            resolve(square);
          }
          if (parseSquare(ParseDiagonalNorthEastSouthWest, square)) {
            resolve(square);
          }
        }
        if (! bestSquare.opponentIsTheWinnerFound) {
            if (bestSquare.localScore > bestSquare.score) {
              bestSquare.score = bestSquare.localScore;
              bestSquare.square = square;
            }
        }
        console.debug(bestSquare.square, bestSquare.localScore);
      }

      resolve(bestSquare.square);
    });

  return promiseReturn;

};

// vim: ts=2 sw=2 et:
