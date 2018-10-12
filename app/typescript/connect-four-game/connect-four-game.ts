/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED: Fri 12 Oct 2018 04:51:51 PM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH, GameMode, ArtificialIntelligence,
      Checker }
    from './constants.js';
import { Square } from './Square.js';
import { SquareOnClick, CursorColor }
    from './square-on-click.js';
import { storeSingleton } from './store-singleton.js';
import { ComputerTurn } from './computer-turn.js';

import { AIRandomTurn } from './artificial-intelligence/ai-random-turn.js';
import { AIHeuristicRow } from './artificial-intelligence/ai-heuristic-row.js';

const parseUrlQueryParamIsComputerToStart: (parsedUrl: URL) => void
      = (parsedUrl: URL): void => {
  const isComputerToStartParam: string | null =
          parsedUrl.searchParams.get('is_computer_to_start');
  console.info('URL query param "is_computer_to_start": ',
    isComputerToStartParam);
  if (isComputerToStartParam) {
    switch (isComputerToStartParam) {
      case 'true':
        storeSingleton.isComputerToPlay = true;
        break;
      case 'false':
        storeSingleton.isComputerToPlay = false;
        break;
      default:
        console.warn('The URL param "is_computer_to_start',
          'has not an expected value.',
          'Therefore the first player will be the gamer and not the computer');
    }
  } else {
    console.warn('The URL param "is_computer_to_start" doesn\'t exist.',
      'Therefore the first player will be the gamer and not the computer');
  }
};

const parseUrlQueryParamFirstGamer: (parsedUrl: URL) => void
      = (parsedUrl: URL): void => {
  let firstGamerParam: string | null =
          parsedUrl.searchParams.get('first_gamer');
  console.info('URL query param "first_gamer": ', firstGamerParam);
  if (firstGamerParam) {
    firstGamerParam = firstGamerParam.toUpperCase();
    switch (firstGamerParam) {
      case Checker[Checker.RED]:
        storeSingleton.currentGamer = Checker.RED;
        break;
      case Checker[Checker.YELLOW]:
        storeSingleton.currentGamer = Checker.YELLOW;
        break;
      default:
        console.warn('The URL param "first_gamer" has not an expected value.',
          'Therefore the first player will be "red"');
    }
  } else {
    console.warn('The URL param "first_gamer" doesn\'t exist.',
      'Therefore the first player will be "red"');
  }
};

const parseUrlQueryParamGamemode: (parsedUrl: URL) => void
      = (parsedUrl: URL): void => {
  let gameModeParam: string | null = parsedUrl.searchParams.get('gamemode');
  console.info('URL query param "gamemode": ', gameModeParam);
  if (gameModeParam) {
    gameModeParam = gameModeParam.toUpperCase();
    switch (gameModeParam) {
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
        console.warn('The URL param "gamemode" has not an expected value.',
          'Therefore the game will be "multiplayer"');
    }
  } else {
    console.warn('The URL param "gamemode" doesn\'t exist.',
      'Therefore the game will be "multiplayer"');
  }
};

const parseUrlQueryParamArtificialIntelligenceGamerRed: (parsedUrl: URL,
      paramName: string)
          => void
      = (parsedUrl: URL, paramName: string): void => {
  let aiParam: string | null = parsedUrl.searchParams.get(paramName);
  console.info('URL query param "' + paramName + '": ', aiParam);
  if (aiParam) {
    aiParam = aiParam.toUpperCase();
    switch (aiParam) {
      case ArtificialIntelligence[ArtificialIntelligence.RANDOM]:
        if (aiParam === 'ai_red') {
          storeSingleton.artificialIntelligenceGamerRed = AIRandomTurn;
        }
        if (aiParam === 'ai_yellow') {
          storeSingleton.artificialIntelligenceGamerYellow = AIRandomTurn;
        }
        break;
      case ArtificialIntelligence[ArtificialIntelligence.HEURISTIC_ROW]:
        if (paramName === 'ai_red') {
          storeSingleton.artificialIntelligenceGamerRed = AIHeuristicRow;
        }
        if (paramName === 'ai_yellow') {
          storeSingleton.artificialIntelligenceGamerYellow = AIHeuristicRow;
        }
        console.log(storeSingleton);
        break;
      default:
        console.warn('The URL param "' + aiParam +
          '" has not an expected value.',
          'Therefore the artificial intelligence used for the red gamer' +
          'will be "heuristic_row"');
    }
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
      'FATAL ERROR. Can\'t access to the `document.location\' object';
    alert (messageError);
    console.error(messageError);
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
