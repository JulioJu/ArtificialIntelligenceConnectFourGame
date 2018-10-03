/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Tue 25 Sep 2018 02:42:40 PM CEST
  *       MODIFIED: Wed 03 Oct 2018 09:38:47 AM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

interface IFormGame extends HTMLFormControlsCollection {
  gamemode: RadioNodeList;
}

// Could be null. But don't crash if it's null (id deleted in source code)
// If id is deleted in inspector, continue to work (event is already
// attached)
const form: HTMLFormElement = document
  .getElementById('customizeGame') as HTMLFormElement;

form.addEventListener('submit',
  (e: Event) => {
    e.preventDefault();
    const formElement: IFormGame = form.elements as IFormGame;
    console.log(formElement.gamemode.value);
    document.location.assign('connect-four-game.html?gamemode='
      + formElement.gamemode.value);
  },
  false);

// vim: ts=2 sw=2 et:
