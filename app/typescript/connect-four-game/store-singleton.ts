/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 29 Sep 2018 03:38:08 PM CEST
  *       MODIFIED: Thu 21 Mar 2019 01:31:29 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GameMode, Checker } from './constants.js';
import { Square } from './Square.js';

import { AIRandomTurn } from './artificial-intelligence/random/ai-random-turn';

export class StatisticsTreeExploration {
  // public maxDepthEffectivelyExplored: number;
  public numberOfNodes: number;
  public numberOfLeaves: number;
  public constructor(
    // tslint:disable-next-line
    // @ts-ignore
    private readonly maxDepth: number
  ) {
    // this.maxDepthEffectivelyExplored = 0;
    this.numberOfNodes = 0;
    this.numberOfLeaves = 0;
  }
}

export interface ILogMessage {
  checker: string;
  timeSpan: number;
  div?: HTMLElement;
  statistics?: StatisticsTreeExploration;
}

interface IStoreSingleton {
  // tslint:disable-next-line:no-any
  [indexSignaure: string]: any;
  gameMode: GameMode;
  grid: Square[][];
  currentGamer: Checker;
  opponentGamer(): Checker;
  isComputerToPlay: boolean;
  gameIsTerminated: boolean;
  squaresEmptyPlayable: Square[];
  squaresEmptyPlayableContains(square: Square): boolean;
  numberOfClick: number;

  artificialIntelligenceGamerRed(): Square | undefined;
  artificialIntelligenceRedDeep: number;
  artificialIntelligenceGamerYellow(): Square | undefined;
  artificialIntelligenceYellowDeep: number;

  logMessages: { [key: number]: ILogMessage };

  styleSheet: CSSStyleSheet ;
}

const instantiateStyleSheet: () => CSSStyleSheet = (): CSSStyleSheet => {
  const htmlStylElement: HTMLStyleElement =
    document.getElementById('generatedByCSSOM') as HTMLStyleElement;

  return htmlStylElement.sheet as CSSStyleSheet;
};

// All are instantiated in ./connect-four-game.ts
export const storeSingleton: IStoreSingleton = {

  // Not changed during the game:
  gameMode: GameMode.MULTIPLAYER,
  grid: new Array(GRID_COLUMN_LENGTH),

  // Values changed each time square-add-checker.ts is called:
  currentGamer: Checker.RED,
  // tslint:disable-next-line:object-literal-shorthand
  opponentGamer: function(): Checker {
    return this.currentGamer === Checker.RED
      ? Checker.YELLOW
      : Checker.RED;
  },
  isComputerToPlay: false,
  gameIsTerminated: false,
  squaresEmptyPlayable: new Array(GRID_COLUMN_LENGTH),
  // tslint:disable-next-line:object-literal-shorthand
  squaresEmptyPlayableContains: function(squareTested: Square): boolean {
    let returnValue: boolean = false;
    for (const squareOfLoop of this.squaresEmptyPlayable) {
      if (squareOfLoop.equals(squareTested)) {
        returnValue = true;
        break;
      }
    }
    return returnValue;
  },
  numberOfClick: 0,

  artificialIntelligenceGamerRed: AIRandomTurn,
  artificialIntelligenceRedDeep: 1,
  artificialIntelligenceGamerYellow: AIRandomTurn,
  artificialIntelligenceYellowDeep: 1,

  logMessages: {},

  styleSheet: instantiateStyleSheet()
};

// vim: ts=2 sw=2 et:
