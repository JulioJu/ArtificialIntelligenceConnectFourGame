/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Tue 25 Sep 2018 02:42:40 PM CEST
  *       MODIFIED: Fri 12 Oct 2018 10:18:32 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

import { ShowHideElementTriggeredByRadioButton } from './hide-show.js';

interface IFormGame extends HTMLFormControlsCollection {
  gamemode: RadioNodeList;
  is_computer_to_start: RadioNodeList;
  first_gamer: RadioNodeList;
  ai_red: RadioNodeList;
  ai_yellow: RadioNodeList;
}

const submitForm: () => void = (): void => {
  // Could be null. But don't crash if it's null (id deleted in source code)
  // If id is deleted in inspector, continue to work (event is already
  // attached)
  const form: HTMLFormElement = document
    .getElementById('customizeGame') as HTMLFormElement;

  form.addEventListener('submit',
    (e: Event) => {
      e.preventDefault();
      const formElement: IFormGame = form.elements as IFormGame;
      let url: string = 'connect-four-game.html?gamemode='
          + formElement.gamemode.value +
          '&first_gamer=' + formElement.first_gamer.value +
          '&ai_red=' + formElement.ai_red.value +
          '&ai_yellow=' + formElement.ai_yellow.value;
      if (formElement.gamemode.value === 'vscomputer') {
        url +=
          '&is_computer_to_start=' + formElement.is_computer_to_start.value;
      }
      if (document.location) {
        document.location.assign(url);
      } else {
        const messageError: string =
          'FATAL ERROR. Can\'t access to the `document.location\' object';
        alert (messageError);
        console.error(messageError);
      }
    },
    false);
};

ShowHideElementTriggeredByRadioButton('is_computer_to_start', 'gamemode',
  'vscomputer', true);
ShowHideElementTriggeredByRadioButton('notice_for_human_gamer', 'gamemode',
  'only_computer', false);
submitForm();

// vim: ts=2 sw=2 et:
