/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Wed 10 Oct 2018 04:36:45 PM CEST
  *       MODIFIED: Wed 10 Oct 2018 04:38:09 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

export const ShowHideElementTriggeredByRadioButton:
    (idElementToHideOrShow: string,
      nameOfRadioGroup: string, valueOfTheRadioButton: string,
      isExpendedIfChecked: boolean) => void
    = (idElementToHideOrShow: string, nameOfRadioGroup: string,
      valueOfTheRadioButton: string, isExpendedIfChecked: boolean): void => {

  const elementToHideOrShowHtmlElement: HTMLElement | null = document
    .getElementById(idElementToHideOrShow);

  const actionIfRadioChecked: string = isExpendedIfChecked
          ? 'expended'
          : 'collapsed';

  const actionIfRadioUnchecked: string = isExpendedIfChecked
          ? 'collapsed'
          : 'expended';

  if (elementToHideOrShowHtmlElement) {

    // When page is loaded

    const radioButtonHtmlElement: HTMLInputElement | null = document
      .querySelector('input[type="radio"][name="' + nameOfRadioGroup +
        '"][value="' + valueOfTheRadioButton + '"]');
    if (radioButtonHtmlElement && radioButtonHtmlElement.checked) {
      elementToHideOrShowHtmlElement.classList.add(actionIfRadioChecked);
    } else {
      elementToHideOrShowHtmlElement.classList.add(actionIfRadioUnchecked);
    }

    // Event Listener

    const radioGroup: NodeListOf<HTMLElement> | null = document
      .getElementsByName(nameOfRadioGroup);
    if (radioGroup) {
      for (const radioButton of radioGroup) {
        const radioButtonHtmlElementLoop: HTMLInputElement =
          radioButton as HTMLInputElement;
        radioButtonHtmlElementLoop.addEventListener('change',
          (e: Event) => {
            e.preventDefault();
            if (radioButtonHtmlElementLoop.checked
                  && radioButtonHtmlElementLoop.value
                      === valueOfTheRadioButton) {
              console.log('coucou');
              elementToHideOrShowHtmlElement.classList
                .add(actionIfRadioChecked);
              elementToHideOrShowHtmlElement.classList
                .remove(actionIfRadioUnchecked);
            } else {
              elementToHideOrShowHtmlElement.classList
                .remove(actionIfRadioChecked);
              elementToHideOrShowHtmlElement.classList
                .add(actionIfRadioUnchecked);
            }
          },
          false);
      }
    }

  }
};

// vim: ts=2 sw=2 et:
