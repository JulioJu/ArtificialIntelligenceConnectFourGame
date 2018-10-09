/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Sat 06 Oct 2018 05:48:31 PM CEST
 *       MODIFIED: Tue 09 Oct 2018 01:12:17 PM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { Square } from '../Square.js';
import { storeSingleton } from '../store-singleton.js';
import { ParseLineResult } from '../artificial-intelligence/ParseLineResult.js';
import { parseHorizontally } from '../artificial-intelligence/parse_lines.js';

export const AIHeuristic1: () => Promise<Square>
      = async (): Promise<Square> =>
  new Promise<Square>((resolve: (square: Square) => void,
        reject: (drawnMatches: Error) => void): void => {
    const squaresEmptyPlayable: Square[] = storeSingleton.squaresEmptyPlayable;
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

    for (let index: number = 0
          ; index < squareEmptyPlayableParsed.length
          ; index++) {
      squareEmptyPlayableParsed[index] = parseHorizontally(
        storeSingleton.squaresEmptyPlayable[index]
      );
      console.log(squareEmptyPlayableParsed[index]);
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

// vim: ts=2 sw=2 et:
