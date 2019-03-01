/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 29 Sep 2018 03:38:08 PM CEST
  *       MODIFIED: Fri 01 Mar 2019 02:37:01 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GameMode, Checker } from './constants.js';
import { Square } from './Square.js';

import { AIRandomTurn } from './artificial-intelligence/random/ai-random-turn';

interface IStoreSingleton {
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
  artificialIntelligenceGamerYellow(): Square | undefined;

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
  artificialIntelligenceGamerYellow: AIRandomTurn,

  styleSheet: instantiateStyleSheet()
};

// vim: ts=2 sw=2 et:
