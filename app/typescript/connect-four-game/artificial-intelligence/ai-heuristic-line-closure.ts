/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Mon 15 Oct 2018 09:24:13 AM CEST
  *       MODIFIED: Tue 23 Oct 2018 05:45:26 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../Square.js';
import { storeSingleton } from '../store-singleton.js';
import { ParseLineResult } from './ParseLineResult.js';

export const AIHeuristicLineClosure:
          (parseLine: (square: Square) => ParseLineResult)
              => () => Promise<Square>
      = (parseLine: (square: Square) => ParseLineResult):
          () => Promise<Square> => {

  const promiseReturn: () => Promise<Square> = async (): Promise<Square> =>
    new Promise((resolve: (square: Square) => void,
          reject: (drawnMatches: Error) => void): void => {
      const squaresEmptyPlayable: Square[] =
            storeSingleton.squaresEmptyPlayable;
      if (squaresEmptyPlayable.length === 0) {
        // https://en.wikipedia.org/wiki/Defensive_programming
        // Should never be triggered.
        reject(new Error('Drawn matches'));
      }

      const squareEmptyPlayableParsed: ParseLineResult[] = new Array(
        storeSingleton.squaresEmptyPlayable.length
      );

      // Always reassign, because score = -1;
      let bestSquareEmptyPlayableParsed: Square = squaresEmptyPlayable[0];
      let score: number = -1;
      let opponentIsTheWinnerFound: boolean = false;

      for (let index: number = 0 ;
            index < squareEmptyPlayableParsed.length ;
            index++) {
        squareEmptyPlayableParsed[index] = parseLine(
          storeSingleton.squaresEmptyPlayable[index]
        );
        console.debug(squareEmptyPlayableParsed[index]);
        if (squareEmptyPlayableParsed[index].gamerIsTheWinner) {
          resolve(squareEmptyPlayableParsed[index].square);
        }

        if (! opponentIsTheWinnerFound) {
          if (squareEmptyPlayableParsed[index].opponentIsTheWinner) {
            bestSquareEmptyPlayableParsed = squareEmptyPlayableParsed[index]
              .square;
            // Better to try to avoid that the opponent will be the winner.
            opponentIsTheWinnerFound = true;
          } else {
            const localScore: number = squareEmptyPlayableParsed[index].score;
            if (localScore > score) {
              score = localScore;
              bestSquareEmptyPlayableParsed =
                squareEmptyPlayableParsed[index].square;
            }
          }
        }

      }

      resolve(bestSquareEmptyPlayableParsed);
  });

  return promiseReturn;

};

// vim: ts=2 sw=2 et:
