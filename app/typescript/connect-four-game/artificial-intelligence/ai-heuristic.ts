/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 09:24:13 AM CEST
  *       MODIFIED: Thu 25 Oct 2018 11:55:53 PM CEST
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
  public square: Square | undefined = undefined;
}

type heuristicCallbackType =
  (square: Square, isSquareGamable?: boolean) => ParseLineResult;

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

type parseLineCorePromiseType = (
  heuristicCallback: heuristicCallbackType,
  squareParsed: Square,
  bestSquare: BestSquare) => boolean;
const parseSquare: parseLineCorePromiseType =
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

      const bestSquare: BestSquare = new BestSquare();
      bestSquare.square = squaresEmptyPlayable[0];

      for (const square of squaresEmptyPlayable) {
        bestSquare.localScore = 0;
        if (heuristicCallback) {
          if (parseSquare(heuristicCallback, square, bestSquare)) {
            resolve(square);
            return;
          }
        } else {
          // HERE, WE ARE NOT IN A CLOSURE, BECAUSE THE FUNCTION IS CALLED
          // WITHOUT PARAMS
          if (parseSquare(ParseHorizontally, square, bestSquare)) {
            resolve(square);
            return;
          }
          if (parseSquare(ParseDiagnoalNorthWestSouthEast, square,
                bestSquare)) {
            resolve(square);
            return;
          }
          if (parseSquare(ParseVertically, square, bestSquare)) {
            resolve(square);
            return;
          }
          if (parseSquare(ParseDiagonalNorthEastSouthWest, square,
                bestSquare)) {
            resolve(square);
            return;
          }
          if (square.rowIndex - 1 > 0) {
            if (IsGamerWin(
                  storeSingleton.grid[square.columnIndex][square.rowIndex - 1],
                  storeSingleton.opponentGamer())) {
              // Better to try to avoid that the opponent will be the winner.
              bestSquare.localScore = -1;
              console.debug('Opponent will win if you play here');
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
      resolve(bestSquare.square);
      return;
    });

  return promiseReturn;

};

// vim: ts=2 sw=2 et:
