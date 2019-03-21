/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Tue 23 Oct 2018 04:25:08 PM CEST
  *       MODIFIED: Thu 21 Mar 2019 01:46:54 PM CET
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { ErrorFatal } from '../util/error_message.js';

import { GameMode, ArtificialIntelligence, Checker } from './constants.js';
import { storeSingleton } from './store-singleton.js';

import {
  // RANDOM
  // ======
  AIRandomTurn,

  // WIN LOST RANDOM
  // ======
  AIWinLostRandomTurn,

  // HEURISTIC
  // =========
  ParseHorizontally,
  ParseDiagnoalNorthWestSouthEast,
  ParseVertically,
  ParseDiagonalNorthEastSouthWest,
  AIHeuristicLineClosure,

  // MINIMAXNOHEUR
  // ======
  AIDepthExplorationTurn
} from './artificial-intelligence/index.js';

const infoParam: (paramName: string, paramValue: string | null) => void
      = (paramName: string, paramValue: string | null): void => {
  console.info('URL query param', paramName, '": ', paramValue);
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

const parseUrlQueryParamArtificialIntelligence: (parsedUrl: URL,
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
    // tslint:disable-next-line
    // @ts-ignore
    const artificialIntelligenceGamer: string = paramName === 'ai_red'
      ? 'artificialIntelligenceGamerRed'
      : 'artificialIntelligenceGamerYellow';
    switch (paramValue) {

      // RANDOM
      // ======
      case ArtificialIntelligence[ArtificialIntelligence.RANDOM]:
        storeSingleton[artificialIntelligenceGamer] = AIRandomTurn;
        break;

      // HEURISTIC WIN LOST RANDOM
      // ======
      case ArtificialIntelligence[ArtificialIntelligence
          .WIN_LOST_RANDOM]:
        storeSingleton[artificialIntelligenceGamer] = AIWinLostRandomTurn;
        break;

      // HEURISTIC
      // =========
      case ArtificialIntelligence[ArtificialIntelligence.HEURISTIC_HORIZONTAL]:
        storeSingleton[artificialIntelligenceGamer] =
          AIHeuristicLineClosure(ParseHorizontally);
        break;
      case ArtificialIntelligence[
          ArtificialIntelligence.HEURISTIC_DIAGONAL_NORTH_WEST_SOUTH_EAST]:
        storeSingleton[artificialIntelligenceGamer] =
            AIHeuristicLineClosure(ParseDiagnoalNorthWestSouthEast);
        break;
      case ArtificialIntelligence[ArtificialIntelligence.HEURISTIC_VERTICAL]:
        storeSingleton[artificialIntelligenceGamer] =
          AIHeuristicLineClosure(ParseVertically);
        break;
      case ArtificialIntelligence[
          ArtificialIntelligence.HEURISTIC_DIAGONAL_NORTH_EAST_SOUTH_WEST]:
        storeSingleton[artificialIntelligenceGamer] =
            AIHeuristicLineClosure(ParseDiagonalNorthEastSouthWest);
        break;
      case ArtificialIntelligence[
          ArtificialIntelligence.HEURISTIC_HORIZONTAL_VERTICAL_DIAGONALS
      ]:
        // HERE, AIHeuristicLineClosure IS NOT CALLED AS CLOSURE
        // BECAUSE IT'S CALLED WITHOUT PARAMS
        storeSingleton[artificialIntelligenceGamer] =
            AIHeuristicLineClosure();
        break;

      // MINIMAXNOHEUR
      // =======
      case ArtificialIntelligence[ArtificialIntelligence.MINIMAXNOHEUR]:
        storeSingleton[artificialIntelligenceGamer] =
          AIDepthExplorationTurn(false);
        break;

      // ALPHABETAPRUNING NO HEURISTIC
      // =======
      case ArtificialIntelligence[ArtificialIntelligence.ALPHABETANOHEUR]:
        storeSingleton[artificialIntelligenceGamer] = AIDepthExplorationTurn(true);
        break;

      default:
          incorrectQueryParam(paramName, true, messageDefaultValue);

    }
  } else {
    incorrectQueryParam(paramName, false, messageDefaultValue);
  }
};

const parseUrlQueryParamArtificialIntelligenceDeep
      = (parsedUrl: URL, paramName: string): void => {
  // tslint:disable-next-line
  // @ts-ignore
  let artificielIntelligenceDeep: string;
  let artificialIntelligenceGamer: string;
  if (
    paramName === 'ai_red_deep'
  ) {
    artificialIntelligenceGamer = 'artificialIntelligenceGamerRed';
    artificielIntelligenceDeep = 'artificialIntelligenceRedDeep';
  } else {
    artificialIntelligenceGamer = 'artificialIntelligenceGamerYellow';
    artificielIntelligenceDeep = 'artificialIntelligenceYellowDeep';
  }
  if (
    `${storeSingleton[artificialIntelligenceGamer]}`
    !== `${AIDepthExplorationTurn(true)}`
  ) {
    return;
  }
  let paramValue: string | null =
    parsedUrl.searchParams.get(paramName);
  infoParam(paramName, paramValue);
  if (paramValue !== null) {
    paramValue = paramValue.toUpperCase();
    storeSingleton[artificielIntelligenceDeep] = parseInt(paramValue, 10);
    if (isNaN(storeSingleton[artificielIntelligenceDeep] as number)) {
      const error = new Error(`Invalid '${paramName}' URL query param`
        + ` Can't parse ${paramValue} to number`);
      ErrorFatal(error.message);
      throw error;
    }
    if (storeSingleton[artificielIntelligenceDeep] as number < 1) {
      const error = new Error(`Invalid '${paramName}' URL query param`
        + ` It can't be < 1`);
      ErrorFatal(error.message);
      throw error;
    }
  }
};

export const ParseUrlQueryParam: () => void = (): void => {
  if (document.location) {
    // See:
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
    // And https://developer.mozilla.org/en-US/docs/Web/API/URL
    const parsedUrl: URL = new URL(document.location.href);
    parseUrlQueryParamGamemode(parsedUrl);
    parseUrlQueryParamFirstGamer(parsedUrl);

    parseUrlQueryParamArtificialIntelligence(parsedUrl, 'ai_red');
    parseUrlQueryParamArtificialIntelligenceDeep(parsedUrl, 'ai_red_deep');
    parseUrlQueryParamArtificialIntelligence(parsedUrl, 'ai_yellow');
    parseUrlQueryParamArtificialIntelligenceDeep(parsedUrl, 'ai_yellow_deep');
    console.log(storeSingleton);

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

// vim: ts=2 sw=2 et:
