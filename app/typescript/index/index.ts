/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Tue 25 Sep 2018 02:42:40 PM CEST
  *       MODIFIED: Thu 04 Oct 2018 04:40:33 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

interface IFormGame extends HTMLFormControlsCollection {
  gamemode: RadioNodeList;
  is_computer_to_start: RadioNodeList;
  first_gamer: RadioNodeList;
}

// Could be null. But don't crash if it's null (id deleted in source code)
// If id is deleted in inspector, continue to work (event is already
// attached)
const form: HTMLFormElement = document
  .getElementById('customizeGame') as HTMLFormElement;

const sectionIsComputerToStart: HTMLElement | null = document
  .getElementById('is_computer_to_start');
if (sectionIsComputerToStart) {
  const radioVscomputer: HTMLInputElement | null = document
    .querySelector('input[type="radio"][name="gamemode"][value=vscomputer]');
  if (radioVscomputer && radioVscomputer.checked) {
    console.log(radioVscomputer);
    sectionIsComputerToStart.classList.add('expended');
  } else {
    sectionIsComputerToStart.classList.add('collapsed');
  }

  const gameMode: NodeListOf<HTMLElement> | null = document
    .getElementsByName('gamemode');
  if (gameMode) {
    for (const element of gameMode) {
      const gameModeHTMLElement: HTMLInputElement = element as HTMLInputElement;
      gameModeHTMLElement.addEventListener('change',
        (e: Event) => {
          e.preventDefault();
          if (sectionIsComputerToStart) {
            if (gameModeHTMLElement.checked
                  && gameModeHTMLElement.value === 'vscomputer') {
              sectionIsComputerToStart.classList.add('expended');
              sectionIsComputerToStart.classList.remove('collapsed');
            } else {
              sectionIsComputerToStart.classList.remove('expended');
              sectionIsComputerToStart.classList.add('collapsed');
            }
          }
        },
        false);
    }
  }
}

form.addEventListener('submit',
  (e: Event) => {
    e.preventDefault();
    const formElement: IFormGame = form.elements as IFormGame;
    const url: string = 'connect-four-game.html?gamemode=' +
      formElement.gamemode.value + '&first_gamer=' +
      formElement.first_gamer.value + '&is_computer_to_start=' +
      formElement.is_computer_to_start.value;
    if (! window.history.state) {
      const messageError: string = 'You\'re browser does not support history' +
        ' functionnality for local website' +
        '(e.g. you can\'t use Back button to come back ' +
        'to the current page). If your are interested by this ' +
        'functionnality, use Firefox or use a local server' +
        '(e.g Browsersync). See README.md for more informations.';
      console.error(messageError);
      alert (messageError);
    } else {
      history.pushState(undefined, undefined, url);
    }
    document.location.assign(url);
  },
  false);

// vim: ts=2 sw=2 et:
