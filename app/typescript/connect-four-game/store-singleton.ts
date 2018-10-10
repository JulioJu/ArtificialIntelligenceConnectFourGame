/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Sat 29 Sep 2018 03:38:08 PM CEST
  *       MODIFIED: Wed 10 Oct 2018 02:09:14 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { GRID_COLUMN_LENGTH, GameMode, Checker } from './constants.js';
import { Square } from './Square.js';

interface IStoreSingleton {
  gameMode: GameMode;
  grid: Square[][];
  currentGamer: Checker;
  isComputerToPlay: boolean;
  gameIsTerminated: boolean;
  squaresEmptyPlayable: Square[];
  numberOfClick: number;

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
  isComputerToPlay: false,
  gameIsTerminated: false,
  squaresEmptyPlayable: new Array(GRID_COLUMN_LENGTH),
  numberOfClick: 0,

  styleSheet: instantiateStyleSheet()
};

// vim: ts=2 sw=2 et:
