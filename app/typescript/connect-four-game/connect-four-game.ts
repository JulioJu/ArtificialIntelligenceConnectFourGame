/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED: Fri 05 Oct 2018 01:54:15 PM CEST
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

import { GRID_COLUMN_LENGTH, GRID_ROW_LENGTH, GameMode, SquareChecker }
    from './constants.js';
import { Square } from './Square.js';
import { SquareOnClick, CursorColor, GameModeVsComputerComputerTurn }
    from './square-on-click.js';
import { storeSingleton } from './store-singleton.js';

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
      case SquareChecker[SquareChecker.GAMER_RED]:
        storeSingleton.currentGamer = SquareChecker.GAMER_RED;
        break;
      case SquareChecker[SquareChecker.GAMER_YELLOW]:
        storeSingleton.currentGamer = SquareChecker.GAMER_YELLOW;
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

const parseUrlQueryParam: () => void = (): void => {
  // See:
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
  // And https://developer.mozilla.org/en-US/docs/Web/API/URL
  const parsedUrl: URL = new URL(document.location.href);
  parseUrlQueryParamGamemode(parsedUrl);
  parseUrlQueryParamFirstGamer(parsedUrl);
  if (storeSingleton.gameMode === GameMode.VSCOMPUTER) {
    parseUrlQueryParamIsComputerToStart(parsedUrl);
  } else {
    storeSingleton.isComputerToPlay = false;
  }
};

export const main: () => void = (): void => {

  parseUrlQueryParam();

  // Should be after `parseUrlQueryParam()`
  CursorColor();

  const htmlStylElement: HTMLStyleElement =
    document.getElementById('generatedByCSSOM') as HTMLStyleElement;

  // htmlStylElement.innerHTML = '.checker_calculated { height: ' +
  //   (baseCent / GRID_ROW_LENGTH).toString() + '%; }';
  const styleSheet: CSSStyleSheet = htmlStylElement.sheet as CSSStyleSheet;
  const baseCent: number = 100;
  (styleSheet.cssRules[0] as CSSStyleRule).style.height =
    (baseCent / GRID_ROW_LENGTH).toString() + '%';

  for (let columnIndex: number = 0 ;
          columnIndex < GRID_COLUMN_LENGTH ;
          columnIndex++) {

    storeSingleton.grid[columnIndex] = new Array(GRID_ROW_LENGTH);

    const columnHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.classList.add('column');

    for (let rowIndex: number = 0 ; rowIndex < GRID_ROW_LENGTH ; rowIndex++) {

      if (columnIndex === 0) {
        styleSheet.insertRule('.checker_calculated_row_index_' +
          rowIndex.toString() +
              '{ transform:translateY(' +
              (baseCent * rowIndex).toString() + '%); }',
          styleSheet.cssRules.length);
        if (rowIndex === GRID_ROW_LENGTH - 1) {
          console.debug(styleSheet);
        }
      }

      const checker: HTMLElement = document.createElement('div');
      checker.classList.add('checker');
      checker.classList.add('checker_calculated');
      checker.classList.add('checker_calculated_row_index_'
        + rowIndex.toString());
      checker.classList.add('checker_empty');
      const square: Square = new Square(columnIndex, rowIndex,
          SquareChecker.EMPTY_SQUARE, checker);
      storeSingleton.grid[columnIndex][rowIndex] = square;

      const squareHTMLElement: HTMLElement = document.createElement('div');
      squareHTMLElement.classList.add('square');
      squareHTMLElement.addEventListener('click', (e: Event) => {
        e.preventDefault();
        SquareOnClick.call(square, styleSheet);
      }, false);

      columnHTMLElement.appendChild(checker);

      columnHTMLElement.appendChild(squareHTMLElement);

    }

    document.body.appendChild(columnHTMLElement);

    const squareRedHTMLElement: HTMLElement = document.createElement('div');
    columnHTMLElement.appendChild(squareRedHTMLElement);

  }

  if (storeSingleton.isComputerToPlay) {
    GameModeVsComputerComputerTurn(styleSheet);
  }

};

// vim: ts=2 sw=2 et:
