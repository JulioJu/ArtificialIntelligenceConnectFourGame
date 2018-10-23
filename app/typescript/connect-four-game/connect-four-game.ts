/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED: Tue 23 Oct 2018 04:22:15 PM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { ErrorFatal } from '../util/error_message.js';

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH, GameMode, ArtificialIntelligence,
      Checker }
    from './constants.js';
import { Square } from './Square.js';
import { SquareOnClick, CursorColor }
    from './square-on-click.js';
import { storeSingleton } from './store-singleton.js';
import { ComputerTurn } from './computer-turn.js';

import { AIRandomTurn } from './artificial-intelligence/ai-random-turn.js';

import { ParseHorizontally } from
    './artificial-intelligence/ai-heuristic-line-row.js';
import { ParseVertically } from
    './artificial-intelligence/ai-heuristic-line-column.js';
import { AIHeuristicLineClosure }
    from './artificial-intelligence/ai-heuristic-line-closure.js';

const infoParam: (paramName: string, paramValue: string | null) => void
      = (paramName: string, paramValue: string | null): void => {
  console.info('URL query param', paramName, '": ', paramValue + '.');
};

const incorrectQueryParam: (paramName: string, isExist: boolean,
          messageDefaultValue: string) => void
      = (paramName: string, isExist: boolean,
          messageDefaultValue: string): void => {
  if (isExist) {
    console.warn('The URL param"', paramName, '"has not an expected value.',
      'Therefore', messageDefaultValue);
  } else {
    console.warn('The URL param"', paramName, '"doesn\'t exist.',
      'Therefore', messageDefaultValue);
  }
};

const parseUrlQueryParamIsComputerToStart: (parsedUrl: URL) => void
      = (parsedUrl: URL): void => {
  const paramName: string = 'is_computer_to_start';
  let paramValue: string | null =
          parsedUrl.searchParams.get(paramName);
  const messageDefaultValue: string =
          'the first player will be the gamer and not the computer.';
  infoParam(paramName, paramValue);
  if (paramValue) {
    paramValue = paramValue.toUpperCase();
    switch (paramValue) {
      case 'TRUE':
        storeSingleton.isComputerToPlay = true;
        break;
      case 'FALSE':
        storeSingleton.isComputerToPlay = false;
        break;
      default:
        incorrectQueryParam(paramName, true, messageDefaultValue);
    }
  } else {
    incorrectQueryParam(paramName, false, messageDefaultValue);
  }
};

const parseUrlQueryParamFirstGamer: (parsedUrl: URL) => void
      = (parsedUrl: URL): void => {
  const paramName: string = 'first_gamer';
  let paramValue: string | null =
          parsedUrl.searchParams.get(paramName);
  const messageDefaultValue: string = 'the first player will be "red".';
  infoParam(paramName, paramValue);
  if (paramValue) {
    paramValue = paramValue.toUpperCase();
    switch (paramValue) {
      case Checker[Checker.RED]:
        storeSingleton.currentGamer = Checker.RED;
        break;
      case Checker[Checker.YELLOW]:
        storeSingleton.currentGamer = Checker.YELLOW;
        break;
      default:
        incorrectQueryParam(paramName, true, messageDefaultValue);
    }
  } else {
    incorrectQueryParam(paramName, false, messageDefaultValue);
  }
};

const parseUrlQueryParamGamemode: (parsedUrl: URL) => void
      = (parsedUrl: URL): void => {
  const paramName: string = 'gamemode';
  let paramValue: string | null =
          parsedUrl.searchParams.get(paramName);
  const messageDefaultValue: string = 'the game will be "multiplayer"';
  infoParam(paramName, paramValue);
  if (paramValue) {
    paramValue = paramValue.toUpperCase();
    switch (paramValue) {
      case GameMode[GameMode.MULTIPLAYER]:
        storeSingleton.gameMode = GameMode.MULTIPLAYER;
        break;
      case GameMode[GameMode.VSCOMPUTER]:
        storeSingleton.gameMode = GameMode.VSCOMPUTER;
        break;
      case GameMode[GameMode.ONLY_COMPUTER]:
        storeSingleton.gameMode = GameMode.ONLY_COMPUTER;
        break;
      default:
        incorrectQueryParam(paramName, true, messageDefaultValue);
    }
  } else {
    incorrectQueryParam(paramName, false, messageDefaultValue);
  }
};

const parseUrlQueryParamArtificialIntelligenceGamerRed: (parsedUrl: URL,
      paramName: string)
          => void
      = (parsedUrl: URL, paramName: string): void => {
  let paramValue: string | null =
          parsedUrl.searchParams.get(paramName);
  const messageDefaultValue: string = 'the artificial intelligence ' +
          // tslint:disable-next-line:no-magic-numbers
          'used for the ' + paramName.substring(3) + ' gamer will be "random".';
  infoParam(paramName, paramValue);
  if (paramValue) {
    paramValue = paramValue.toUpperCase();
    switch (paramValue) {
      case ArtificialIntelligence[ArtificialIntelligence.RANDOM]:
        if (paramName === 'ai_red') {
          storeSingleton.artificialIntelligenceGamerRed = AIRandomTurn;
        }
        if (paramName === 'ai_yellow') {
          storeSingleton.artificialIntelligenceGamerYellow = AIRandomTurn;
        }
        break;
      case ArtificialIntelligence[ArtificialIntelligence.HEURISTIC_ROW]:
        if (paramName === 'ai_red') {
          storeSingleton.artificialIntelligenceGamerRed =
            AIHeuristicLineClosure(ParseHorizontally);
        }
        if (paramName === 'ai_yellow') {
          storeSingleton.artificialIntelligenceGamerYellow =
            AIHeuristicLineClosure(ParseHorizontally);
        }
        break;
      case ArtificialIntelligence[ArtificialIntelligence.HEURISTIC_COLUMN]:
        if (paramName === 'ai_red') {
          storeSingleton.artificialIntelligenceGamerRed =
            AIHeuristicLineClosure(ParseVertically);
        }
        if (paramName === 'ai_yellow') {
          storeSingleton.artificialIntelligenceGamerYellow =
            AIHeuristicLineClosure(ParseVertically);
        }
        break;
      default:
          incorrectQueryParam(paramName, true, messageDefaultValue);
    }
  } else {
    incorrectQueryParam(paramName, false, messageDefaultValue);
  }
};

const parseUrlQueryParam: () => void = (): void => {
  if (document.location) {
    // See:
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
    // And https://developer.mozilla.org/en-US/docs/Web/API/URL
    const parsedUrl: URL = new URL(document.location.href);
    parseUrlQueryParamGamemode(parsedUrl);
    parseUrlQueryParamFirstGamer(parsedUrl);
    parseUrlQueryParamArtificialIntelligenceGamerRed(parsedUrl, 'ai_red');
    parseUrlQueryParamArtificialIntelligenceGamerRed(parsedUrl, 'ai_yellow');
    if (storeSingleton.gameMode === GameMode.VSCOMPUTER) {
      parseUrlQueryParamIsComputerToStart(parsedUrl);
    } else {
      storeSingleton.isComputerToPlay = false;
    }
  } else {
    const messageError: string =
      'can\'t access to the `document.location\' object';
    ErrorFatal(messageError);
  }
};

const triggerComputerGame: () => void = (): void => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    const keyName: string = event.key;
    if (keyName === 'c') {
      ComputerTurn();
      return;
    }
  }, false);
};

export const main: () => void = (): void => {

  parseUrlQueryParam();
  if (storeSingleton.gameMode !== GameMode.ONLY_COMPUTER) {
    triggerComputerGame();
    // Should be after `parseUrlQueryParam()`
    CursorColor();
  } else {
    document.body.classList.add('cursor-not-allowed');
  }

  const baseCent: number = 100;
  (storeSingleton.styleSheet.cssRules[0] as CSSStyleRule).style.height =
    (baseCent / GRID_ROW_LENGTH).toString() + '%';

  for (let columnIndex: number = 0 ;
          columnIndex < GRID_COLUMN_LENGTH ;
          columnIndex++) {

    storeSingleton.grid[columnIndex] = new Array(GRID_ROW_LENGTH);

    const columnHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.classList.add('column');

    for (let rowIndex: number = 0 ; rowIndex < GRID_ROW_LENGTH ; rowIndex++) {

      if (columnIndex === 0) {
        storeSingleton.styleSheet.insertRule('.checker_calculated_row_index_' +
          rowIndex.toString() +
              '{ transform:translateY(' +
              (baseCent * rowIndex).toString() + '%); }',
          storeSingleton.styleSheet.cssRules.length);
        // if (rowIndex === GRID_ROW_LENGTH - 1) {
        //   console.debug(styleSheet);
        // }
      }

      const checker: HTMLElement = document.createElement('div');
      checker.classList.add('checker');
      checker.classList.add('checker_calculated');
      checker.classList.add('checker_calculated_row_index_'
        + rowIndex.toString());
      checker.classList.add('checker_empty');
      const square: Square = new Square(columnIndex, rowIndex,
          Checker.EMPTY, checker);
      storeSingleton.grid[columnIndex][rowIndex] = square;

      if (rowIndex === GRID_ROW_LENGTH - 1) {
        storeSingleton.squaresEmptyPlayable[columnIndex] =
          storeSingleton.grid[columnIndex][GRID_ROW_LENGTH - 1];
      }

      const squareHTMLElement: HTMLElement = document.createElement('div');
      squareHTMLElement.classList.add('square');
      if (storeSingleton.gameMode !== GameMode.ONLY_COMPUTER) {
        squareHTMLElement.addEventListener('click', (e: Event) => {
          e.preventDefault();
          SquareOnClick.call(square, storeSingleton.styleSheet);
        }, false);
      }

      columnHTMLElement.appendChild(checker);

      columnHTMLElement.appendChild(squareHTMLElement);

    }

    document.body.appendChild(columnHTMLElement);

    const squareRedHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.appendChild(squareRedHTMLElement);

  }

  if (storeSingleton.gameMode === GameMode.VSCOMPUTER
        && storeSingleton.isComputerToPlay) {
    ComputerTurn();
  } else if (storeSingleton.gameMode === GameMode.ONLY_COMPUTER) {
    ComputerTurn();
  }

};

main();

// vim: ts=2 sw=2 et:
