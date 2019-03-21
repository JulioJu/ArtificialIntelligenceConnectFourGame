/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
k *       MODIFIED: Thu 21 Mar 2019 01:37:53 PM CET
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
  // TODO actually not copied in StatisticsTreeExploration
  public maxDepthReached: number;
  public score: number;

  /** Just for debug */
  public squareInheritedPath?: SquareDepthScore;
  /**
   *  type could be `undefined` only if `alphaBetaPruningOptimization === true`.
   *    Otherwise never undefined.
   *
   *  type only `SquareDepthScore` if `alphaBetaPruningOptimization === false`
   *
   *  Just for debug.
   */
  public squareEmptyPlayableScores: Array<SquareDepthScore | undefined>;

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
const returnMinOrMaxSquare = (
  squareDepthScore: Array<SquareDepthScore | undefined>,
  isOddDepth: boolean,
  alphaBetaPruningOptimization: boolean
): SquareDepthScore | undefined => {

  // SquareDepthScore[0] is never undefined
  let minOrMaxSquare: SquareDepthScore =
    squareDepthScore[0] as SquareDepthScore;

  let allHasSameValue = true;
  const callback = isOddDepth
      // Search min
      ? (maxScoreC: number, score: number): boolean =>  maxScoreC > score
      // Search max
      : (maxScoreC: number, score: number): boolean => maxScoreC < score;
  for (
    let squareIndex = 1 ;
    squareIndex < squareDepthScore.length ;
    squareIndex++
  ) {
    const square = squareDepthScore[squareIndex];
    if (typeof square === 'undefined') {
      break;
    }
    if (
      square.score
      // squareDepthScore[squareIndex - 1] is never `undefined`
        !== (squareDepthScore[squareIndex - 1] as SquareDepthScore).score
    ) {
      allHasSameValue = false;
    }
    if (callback(minOrMaxSquare.score, square.score)) {
      minOrMaxSquare = square;
    }
  }
  if (allHasSameValue && ! alphaBetaPruningOptimization) {
    minOrMaxSquare.score = isOddDepth
      ? minOrMaxSquare.score - 0.0001
      : minOrMaxSquare.score + 0.0001;
  }
  return minOrMaxSquare;
};

const MinimaxNoHeurRecursivity = (
  statistics: StatisticsTreeExploration,
  depthMax: number,
  squareDepthScore: SquareDepthScore,
  alphaBetaPruningOptimization: boolean
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
  const squareEmptyPlayableScores: Array<SquareDepthScore | undefined> =
    new Array(squareEmptyPlayable.length);
  for (let index = 0 ; index < squareEmptyPlayableScores.length ; index++) {
    const squareAdded = squareEmptyPlayable[index];

    const squareEmptyPlayableScore = new SquareDepthScore(
      Checker[storeSingleton.currentGamer], squareAdded,
      squareDepthScore.depth + 1
    );
    squareEmptyPlayableScores[index] = squareEmptyPlayableScore;

    squareAdded.squareValue = storeSingleton.currentGamer;
    MinimaxNoHeurRecursivity(
      statistics,
      depthMax,
      squareEmptyPlayableScore,
      alphaBetaPruningOptimization
    );
    squareAdded.squareValue = Checker.EMPTY;

    if (
      alphaBetaPruningOptimization
      && squareEmptyPlayableScore.score !== 0
    ) {
      break;
    }
  }
  storeSingleton.currentGamer = storeSingleton.opponentGamer();

  squareDepthScore.squareInheritedPath = returnMinOrMaxSquare(
    squareEmptyPlayableScores,
    squareDepthScore.isOddDepth,
    alphaBetaPruningOptimization
  );

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
const MinimaxNoHeur = (depthMax: number,
    alphaBetaPruningOptimization: boolean): number => {
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
    MinimaxNoHeurRecursivity(
      statistics,
      depthMax,
      squareDepthScore,
      alphaBetaPruningOptimization);
    squareAdded.squareValue = Checker.EMPTY;

    // VERY IMPORTANT TO CLEAR, OTHERWISE THE BROWSER CRASH IF
    // THERE IS TOO MUCH LOGS.
    if (alphaBetaPruningOptimization || depthMax <= 5) {
    console.clear();
    }

    console.debug(squareAdded, squareDepthScore.score);

    /* For the first one */
    if (typeof maxScore === 'undefined') {
      maxScore = squareDepthScore;
      if (alphaBetaPruningOptimization && squareDepthScore.score === 1) {
        break;
      }
      continue;
    }

    if (maxScore.score < squareDepthScore.score) {
      maxScore = squareDepthScore;
      squareToPlayIndex = squareIndex;
    }
    if (alphaBetaPruningOptimization && squareDepthScore.score === 1) {
      break;
    }
  }
  storeSingleton.logMessages[storeSingleton.numberOfClick + 1] = {
    checker: Checker[storeSingleton.currentGamer],
    timeSpan: 0,
    statistics
  };
  return squareToPlayIndex;
};

export const AIDepthExplorationTurn
  = (alphaBetaPruningOptimization: boolean): () => Square | undefined =>

  (): Square | undefined => {

    // TODO
    if (storeSingleton.squaresEmptyPlayable.length === 0) {
      // https://en.wikipedia.org/wiki/Defensive_programming
      // Should never be triggered.
      return undefined;
    }

    const deep = storeSingleton.currentGamer === Checker.RED
          ? storeSingleton.artificialIntelligenceRedDeep
          : storeSingleton.artificialIntelligenceYellowDeep;

    return storeSingleton.squaresEmptyPlayable[
      MinimaxNoHeur(deep, alphaBetaPruningOptimization)
    ];

  };

// vim: ts=2 sw=2 et:
