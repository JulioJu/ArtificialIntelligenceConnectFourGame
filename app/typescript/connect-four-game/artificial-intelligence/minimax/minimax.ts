/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
k *       MODIFIED: Thu 14 Mar 2019 05:13:20 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { Square } from '../../Square.js';
import {
  storeSingleton,
  StatisticsTreeExploration
} from '../../store-singleton.js';
import { IsGamerWin } from '../../is-gamer-win.js';
import { PopulateSquareEmptyPlayables }
  from '../../squares-empty-playable-populate.js';
import { Checker } from '../../constants.js';

// tslint:disable:no-magic-numbers max-classes-per-file

class SquareDepthScore {
  public isOddDepth: boolean;
  public drawnMatch: boolean;
  public maxDepthReached: number;
  public score: number;

  /** Just for debug */
  public squareInheritedPath?: SquareDepthScore;
  /** Just for debug */
  public squareEmptyPlayableScores: SquareDepthScore[];

  public constructor (
    /** Just for debug */
    public readonly checker: string,
    /** Just for debug (but used as it because it simplify the code) */
    public readonly square: Square,
    /** Just for debug */
    public readonly depth: number
  ) {
    this.isOddDepth = (depth % 2 !== 0);
    this.drawnMatch = false;
    this.maxDepthReached = depth;
  }
}

/**
 * @param depth >= 0
 *
 */
const calculateScore = (
  square: Square,
  isOddDepth: boolean
): number => {
  let score: number | undefined;
  if (IsGamerWin(square, storeSingleton.currentGamer)) {
    score = 1;
  }
  // tslint:disable-next-line
  // @ts-ignore
  if (typeof score !== 'undefined') {
    // Not useful to devise by depth, but as it we could know
    // when we win.
    return (isOddDepth) ? score : -score;
  }
  return 0;
};

/**
 * @param squareDepthScore squareDepthScore.length > 0
 *
 */
const returnMinOrMaxSquare = (squareDepthScore: SquareDepthScore[],
  isOddDepth: boolean): SquareDepthScore | undefined => {
  let minOrMaxSquare: SquareDepthScore = squareDepthScore[0];
  let allHasSameValue = true;
  const callback = isOddDepth
      // Search min
      ? (maxScoreC: number, score: number): boolean =>  maxScoreC > score
      // Search max
      : (maxScoreC: number, score: number): boolean => maxScoreC < score;
  for (let squareIndex = 1 ;
      squareIndex < squareDepthScore.length ;
      squareIndex++) {
    const square = squareDepthScore[squareIndex];
    if (square.score !== squareDepthScore[squareIndex - 1].score) {
      allHasSameValue = false;
    }
    if (callback(minOrMaxSquare.score, square.score)) {
      minOrMaxSquare = square;
    }
  }
  if (allHasSameValue) {
    minOrMaxSquare.score = isOddDepth
      ? minOrMaxSquare.score - 0.0001
      : minOrMaxSquare.score + 0.0001;
  }
  return minOrMaxSquare;
};

const MinimaxRecursivity = (
  statistics: StatisticsTreeExploration,
  depthMax: number,
  squareDepthScore: SquareDepthScore
): void => {

  statistics.numberOfNodes++;

  // Tie (drawn matches)
  const squareEmptyPlayable = PopulateSquareEmptyPlayables();
  if (squareEmptyPlayable.length === 0) {
    // TODO
    squareDepthScore.drawnMatch = true;
    return;
  }

  squareDepthScore.score =
    calculateScore(squareDepthScore.square, squareDepthScore.isOddDepth);

  if (squareDepthScore.score !== 0
    || squareDepthScore.depth === depthMax) {
    statistics.numberOfLeaves++;
    return;
  }

  storeSingleton.currentGamer = storeSingleton.opponentGamer();
  let squareEmptyPlayableScores;
  squareEmptyPlayableScores = squareEmptyPlayable.map(
    (squareAdded: Square): SquareDepthScore => {
      const squareDepthScoreInner = new SquareDepthScore(
        Checker[storeSingleton.currentGamer], squareAdded,
        squareDepthScore.depth + 1);
      squareAdded.squareValue = storeSingleton.currentGamer;
      MinimaxRecursivity(statistics, depthMax, squareDepthScoreInner);
      squareAdded.squareValue = Checker.EMPTY;

      return squareDepthScoreInner;
    });
  storeSingleton.currentGamer = storeSingleton.opponentGamer();

  squareDepthScore.squareInheritedPath = returnMinOrMaxSquare(
    squareEmptyPlayableScores, squareDepthScore.isOddDepth);

  // TODO: comment it, just for debug
  squareDepthScore.squareEmptyPlayableScores = squareEmptyPlayableScores;

  if (squareDepthScore.squareInheritedPath) {

  // TODO: comment it, just for debug
    squareDepthScore.score = squareDepthScore.squareInheritedPath.score;

    squareDepthScore.maxDepthReached =
      squareDepthScore.squareInheritedPath.maxDepthReached;

  }
};

/**
 *  @param depthMax should be > 0
 *
 */
const Minimax = (depthMax: number): number => {
  if (depthMax < 1) {
    // https://en.wikipedia.org/wiki/Defensive_programming
    // Should never be triggered.
    throw new Error('Minmax should have a max depth of 1 (include) or more.');
  }
  let squareToPlayIndex = 0;
  let maxScore: SquareDepthScore | undefined;
  const statistics = new StatisticsTreeExploration(depthMax);
  for (let squareIndex: number = 0 ;
    squareIndex < storeSingleton.squaresEmptyPlayable.length ;
    squareIndex++
  ) {
    const squareAdded = storeSingleton.squaresEmptyPlayable[squareIndex];
    squareAdded.squareValue =  storeSingleton.currentGamer;
    const squareDepthScore = new SquareDepthScore(
      Checker[storeSingleton.currentGamer],
      squareAdded, 1);
    MinimaxRecursivity(statistics, depthMax, squareDepthScore);
    squareAdded.squareValue = Checker.EMPTY;

    // VERY IMPORTANT TO CLEAR, OTHERWISE THE BROWSER CRASH IF
    // THERE IS TOO MUCH LOGS.
    console.clear();

    console.debug(squareAdded, squareDepthScore.score,
      'squareDepthScore:', squareDepthScore);

    /* For the first one */
    if (typeof maxScore === 'undefined') {
      maxScore = squareDepthScore;
      continue;
    }

    if (maxScore.score < squareDepthScore.score) {
      maxScore = squareDepthScore;
      squareToPlayIndex = squareIndex;
    }
  }
  console.debug(statistics);
  storeSingleton.logMessages[storeSingleton.numberOfClick + 1] = {
    checker: Checker[storeSingleton.currentGamer],
    timeSpan: 0,
    statistics
  };
  return squareToPlayIndex;
};

export const AIMinimaxTurn: () => Square | undefined
      = (): Square | undefined => {
    // TODO
  if (storeSingleton.squaresEmptyPlayable.length === 0) {
    // https://en.wikipedia.org/wiki/Defensive_programming
    // Should never be triggered.
    return undefined;
  }

  const deep = storeSingleton.currentGamer === Checker.RED
        ? storeSingleton.artificialIntelligenceRedDeep
        : storeSingleton.artificialIntelligenceYellowDeep;

  return storeSingleton.squaresEmptyPlayable[Minimax(deep)];
};

// vim: ts=2 sw=2 et:
