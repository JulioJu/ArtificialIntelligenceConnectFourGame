/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 03 Oct 2018 08:59:51 PM CEST
k *       MODIFIED: Tue 02 Apr 2019 02:43:25 PM CEST
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
import { Checker, SCORE_WIN } from '../../constants.js';
import { BestSquare } from '../heuristic/ai-heuristic.js';

// tslint:disable:no-magic-numbers max-classes-per-file

class SquareDepthScore {
  public isEvenDepth: boolean;
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
    this.isEvenDepth = (depth % 2 !== 0);
    this.drawnMatch = false;
    this.maxDepthReached = depth;
  }
}

/**
 * @param depth >= 0
 *
 */
const scoreIfGamerWin = (
  square: Square,
  isEvenDepth: boolean
): number => {
  let score: number | undefined;
  if (IsGamerWin(square, storeSingleton.currentGamer)) {
    score = SCORE_WIN;
  }
  // tslint:disable-next-line
  // @ts-ignore
  if (typeof score !== 'undefined') {
    // Not useful to devise by depth, but as it we could know
    // when we win.
    return (isEvenDepth) ? score : -score;
  }
  return 0;
};

/**
 * @param squareDepthScore if `alphaBetaPruningOptimization === true` we could
 * have undefined values
 * @param squareDepthScore squareDepthScore.length > 0
 *
 */
const returnMinOrMaxSquare = (
  squareDepthScore: SquareDepthScore[],
  isEvenDepth: boolean,
  isMinimaxNoHeur: boolean
): SquareDepthScore  => {

  let minOrMaxSquare: SquareDepthScore = squareDepthScore[0];

  let allHasSameValue = true;
  const callback = isEvenDepth
      // Search min (e.g. depth 1 for childs that have a depth of 2)
      ? (maxScoreC: number, score: number): boolean => maxScoreC > score
      // Search max (e.g. depth 3 for childs that ave a depth of 4)
      : (maxScoreC: number, score: number): boolean =>  maxScoreC < score;
  for (
    let squareIndex = 1;
    squareIndex < squareDepthScore.length ;
    squareIndex++
  ) {
    const square = squareDepthScore[squareIndex];
    if (
      isMinimaxNoHeur
      && (
        square.score
        !== (squareDepthScore[squareIndex - 1]).score
      )
    ) {
      allHasSameValue = false;
    }
    if (callback(minOrMaxSquare.score, square.score)) {
      minOrMaxSquare = square;
    }
  }
  if (
    isMinimaxNoHeur
    && allHasSameValue
    && Math.abs(minOrMaxSquare.score) === SCORE_WIN
  ) {
    minOrMaxSquare.score = isEvenDepth
      ? minOrMaxSquare.score + 0.0001
      : minOrMaxSquare.score - 0.0001;
  }
  return minOrMaxSquare;
};

const recursivity = (
  statistics: StatisticsTreeExploration,
  depthMax: number,
  squareDepthScore: SquareDepthScore,
  alphaBetaPruningOptimization: boolean,
  heuristic?: () => BestSquare
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
    scoreIfGamerWin(squareDepthScore.square, squareDepthScore.isEvenDepth);
  if (Math.abs(squareDepthScore.score) === SCORE_WIN) {
    statistics.numberOfLeaves++;
    return;
  }

  if (squareDepthScore.depth === depthMax) {
    if (typeof heuristic !== 'undefined') {
      const score = heuristic().score;
      if (score !== 0) {
        squareDepthScore.score = (squareDepthScore.isEvenDepth)
          ? score + 999
          : -score - 999;
      }
    }
    statistics.numberOfLeaves++;
    return;
  }

  storeSingleton.currentGamer = storeSingleton.opponentGamer();
  const squareEmptyPlayableScores: SquareDepthScore[] = [];
  for (const squareAdded of squareEmptyPlayable) {
    const squareEmptyPlayableScore = new SquareDepthScore(
      Checker[storeSingleton.currentGamer], squareAdded,
      squareDepthScore.depth + 1
    );
    squareEmptyPlayableScores.push(squareEmptyPlayableScore);

    squareAdded.squareValue = storeSingleton.currentGamer;
    recursivity(
      statistics,
      depthMax,
      squareEmptyPlayableScore,
      alphaBetaPruningOptimization,
      heuristic
    );
    squareAdded.squareValue = Checker.EMPTY;

    if (alphaBetaPruningOptimization) {
      const scoreToBreak = squareDepthScore.isEvenDepth
        ? -SCORE_WIN
        : SCORE_WIN;
      if (squareEmptyPlayableScore.score === scoreToBreak) {
        break;
      }
    }
  }
  storeSingleton.currentGamer = storeSingleton.opponentGamer();

  squareDepthScore.squareInheritedPath = returnMinOrMaxSquare(
    squareEmptyPlayableScores,
    squareDepthScore.isEvenDepth,
    // if minimax without heuristic
    typeof heuristic === 'undefined' && ! alphaBetaPruningOptimization
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
const depthExploration = (
  depthMax: number,
  alphaBetaPruningOptimization: boolean,
  heuristic?: () => BestSquare
): number => {
  if (depthMax < 1) {
    // https://en.wikipedia.org/wiki/Defensive_programming
    // Should never be triggered.
    throw new Error('Minmax should have a max depth of 1 (include) or more.');
  }
  let squareToPlayIndex = 0;
  let maxScore: SquareDepthScore;
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
    recursivity(
      statistics,
      depthMax,
      squareDepthScore,
      alphaBetaPruningOptimization,
      heuristic
    );
    squareAdded.squareValue = Checker.EMPTY;

    console.debug(squareAdded, squareDepthScore.score);
    console.debug('squareDepthScore:', squareDepthScore);

    if (squareIndex === 0) {
      maxScore = squareDepthScore;
      if (
        alphaBetaPruningOptimization
        && squareDepthScore.score === SCORE_WIN
      ) {
        break;
      }
      continue;
    }

    // tslint:disable-next-line
    // @ts-ignore
    if (maxScore.score < squareDepthScore.score) {
      maxScore = squareDepthScore;
      squareToPlayIndex = squareIndex;
    }
    if (
      alphaBetaPruningOptimization
      && squareDepthScore.score === SCORE_WIN
    ) {
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

export const AIDepthExplorationTurn = (
  alphaBetaPruningOptimization: boolean,
  heuristic?: () => BestSquare
): () => Square | undefined =>

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

    // VERY IMPORTANT TO CLEAR, OTHERWISE THE BROWSER CRASH IF
    // THERE IS TOO MUCH LOGS.
    if (! alphaBetaPruningOptimization && deep > 4) {
      console.clear();
    }

    return storeSingleton.squaresEmptyPlayable[
      depthExploration(deep, alphaBetaPruningOptimization, heuristic)
    ];

  };

// vim: ts=2 sw=2 et:
